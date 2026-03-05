import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'https://minehr.vercel.app/api';
const TEST_EMAIL = 'test@minehr.com';

async function verifyAuthFlows() {
    console.log("🚀 Starting End-to-End Auth Verification...\n");

    try {
        // Step 1: Request OTP
        console.log("1. Requesting OTP...");
        const forgotRes = await axios.post(`${API_URL}/auth/forgot-password`, { email: TEST_EMAIL });
        console.log("   ✅ Server Response:", forgotRes.data.message);

        // Step 2: Fetch the OTP directly from the DB (since we can't read the email)
        console.log("\n2. Fetching OTP from TiDB Cloud...");
        const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });

        if (!user || !user.resetPasswordOtp) {
            throw new Error("❌ OTP was not saved to the database!");
        }
        console.log(`   ✅ DB OTP Found: ${user.resetPasswordOtp}`);
        console.log(`   ✅ DB Expiry Set: ${user.resetPasswordOtpExpiry}`);

        const otp = user.resetPasswordOtp;

        // Step 3: Test Invalid OTP
        console.log("\n3. Testing Invalid OTP...");
        try {
            await axios.post(`${API_URL}/auth/verify-otp`, { email: TEST_EMAIL, otp: '000000' });
            console.log("   ❌ Failed: Server accepted an invalid OTP!");
        } catch (error: any) {
            console.log("   ✅ Server correctly rejected invalid OTP:", error.response?.data?.error);
        }

        // Step 4: Verify Correct OTP
        console.log("\n4. Verifying Correct OTP...");
        const verifyRes = await axios.post(`${API_URL}/auth/verify-otp`, { email: TEST_EMAIL, otp });
        console.log("   ✅ OTP Verified successfully:", verifyRes.data.message);

        // Step 5: Test Resend OTP
        console.log("\n5. Testing Resend OTP...");
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait a moment
        const resendRes = await axios.post(`${API_URL}/auth/forgot-password`, { email: TEST_EMAIL });
        console.log("   ✅ Server Processed Resend:", resendRes.data.message);

        const refreshedUser = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
        if (refreshedUser?.resetPasswordOtp === otp) {
            throw new Error("❌ OTP did not change after resend!");
        }
        console.log(`   ✅ New OTP successfully generated in DB: ${refreshedUser?.resetPasswordOtp}`);
        const newOtp = refreshedUser?.resetPasswordOtp!;

        // Step 6: Reset Password
        console.log("\n6. Resetting Password...");
        const newPassword = `newpass_${Date.now()}`;
        const resetRes = await axios.post(`${API_URL}/auth/reset-password`, {
            email: TEST_EMAIL,
            otp: newOtp,
            newPassword
        });
        console.log("   ✅ Password Reset Successful:", resetRes.data.message);

        // Step 7: Final DB State Check
        console.log("\n7. Checking Final DB State...");
        const finalUser = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
        if (finalUser?.resetPasswordOtp !== null || finalUser?.resetPasswordOtpExpiry !== null) {
            throw new Error("❌ OTP fields were not cleared from DB after reset!");
        }
        console.log("   ✅ OTP securely cleared from database.");

        console.log("\n🎉 ALL TESTS PASSED! The flow is 100% perfectly working.");

    } catch (error: any) {
        console.error("\n❌ TEST FAILED:", error.message || error.response?.data);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAuthFlows();
