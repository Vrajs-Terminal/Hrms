import "./financedashboard.css";

const FinanceDashboard = () => {
  return (
    <div className="finance-page">

      <div className="finance-filters">
        <select>
          <option>Select Branch</option>
          <option>Ahmedabad</option>
          <option>Jaipur</option>
        </select>

        <select>
          <option>Select Department</option>
          <option>HR</option>
          <option>Accounts</option>
        </select>

        <select>
          <option>January</option>
          <option>February</option>
        </select>

        <select>
          <option>2026</option>
          <option>2025</option>
        </select>

        <button>Generate</button>
      </div>

      <div className="finance-layout">

        <div className="finance-left">
          <div className="finance-cards">

            <div className="f-card purple">
              <h4>Salary Expenses</h4>
              <p>₹ 54,998</p>
            </div>

            <div className="f-card orange">
              <h4>Employee Expenses</h4>
              <p>₹ 4,38,46,229</p>
            </div>

            <div className="f-card green">
              <h4>Loan Expenses</h4>
              <p>₹ 5,30,000</p>
            </div>

            <div className="f-card red">
              <h4>Total Expenses</h4>
              <p>₹ 6,45,000</p>
            </div>

          </div>
        </div>

        <div className="finance-right">
          <div className="finance-chart-box">
            <h3>Branch Wise Distribution</h3>
            <canvas id="financeChart"></canvas>
          </div>
        </div>

      </div>

    </div>
  );
};

export default FinanceDashboard;