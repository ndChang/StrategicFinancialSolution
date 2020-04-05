import React from "react";

//used to fetch data from external source.
import axios from "axios";

//Styles object for HTML.
const styles = {
  container: {
    width: "60%",
  },
  border: {
    border: "1px solid black",
  },
  flex: {
    display: "flex",
  },
  row: {
    width: "140px",
    height: "35px",
  },
  alignEnd: {
    textAlign: "end",
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Defualt value for debtors will be populated when componentDidMount finishes.
      debtors: null,
      //Default value for checkboxes.
      selectAll: true,
      //Default value for last recorded Id of debt.
      count: null,
      //Defualt value for total balance.
      total: 0,
      //Default value for debts listed.
      rows: 0,
      //Default value for debts that are checked.
      rowsChecked: 0,
    };
  }

  //Function that fires upon loading. Will populate our data in state (debtors, count, total).
  async componentDidMount() {
    try {
      //Axios call to retrieve data. Response will be used to populate our state.
      const response = await axios.get(
        "https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json"
      );
      this.setState({
        debtors: response.data,
        count: response.data[response.data.length - 1].id,
      });
    } catch (error) {
      console.error(error);
    }

    //Function run after axios call to calculate total balance.
    this.calculateTotalBalance();
  }

  // Toggles between checked/unchecked of all checkboxes within the table.
  toggle = () => {
    this.setState({ selectAll: !this.state.selectAll });
    let checkboxes = document.getElementsByName("debtor");
    checkboxes.forEach((box) => (box.checked = !this.state.selectAll));
    this.calculateTotalBalance();
  };

  // Renders each row of debtors with their respective data.
  renderDebtors() {
    //Only run if state is populated. Will cause code to crash without data in state.
    if (this.state.debtors) {
      return this.state.debtors.map((debtor) => {
        return (
          <tr style={{ ...styles.flex }} key={debtor.id}>
            <td>
              <input
                type="checkbox"
                name="debtor"
                defaultChecked
                id={debtor.id}
                onClick={() => this.calculateTotalBalance()}
              ></input>
            </td>
            <td style={{ ...styles.border, ...styles.row }}>
              {debtor.creditorName}
            </td>
            <td style={{ ...styles.border, ...styles.row }}>
              {debtor.firstName}
            </td>
            <td style={{ ...styles.border, ...styles.row }}>
              {debtor.lastName}
            </td>
            <td style={{ ...styles.border, ...styles.row, ...styles.alignEnd }}>
              {/* Convert minPaymertPercentage to a fixed 2 floating point value. */}
              {debtor.minPaymentPercentage
                ? parseFloat(debtor.minPaymentPercentage).toFixed(2)
                : null}
              %
            </td>
            <td style={{ ...styles.border, ...styles.row, ...styles.alignEnd }}>
              {/* Convert balance to a fixed 2 floating point value. */}
              {parseFloat(debtor.balance).toFixed(2)}
            </td>
          </tr>
        );
      });
    }
  }

  //Creates a new row with default value for debtor with id/creditorName/balance.
  addDebt = () => {
    const debtors = [...this.state.debtors];
    debtors.push({
      id: ++this.state.count,
      creditorName: "new Bank",
      balance: 3000,
      firstName: "Suman",
      lastName: "Tester79",
    });

    //Set state with new data. Followed by recalculation of total balance.
    this.setState({ debtors }, () => this.calculateTotalBalance());
  };

  //Removes last row of debtor table.
  removeDebt = () => {
    const debtors = [...this.state.debtors];
    debtors.pop();

    //Set state with updated data. Followed by recalculation of total balance.
    this.setState({ debtors }, () => this.calculateTotalBalance());
  };

  //Check the Id of checked box to find the corresponding object to return the balance of that object.
  checkId = (check) => {
    let debtors = this.state.debtors;
    for (let i = 0; i < debtors.length; i++) {
      if (debtors[i].id == check) {
        return debtors[i].balance;
      }
    }
  };

  //Calculates the total balance/rows/rowsChecked.
  calculateTotalBalance = () => {
    //Selects all checkboxes in the table
    let checkboxes = document.getElementsByName("debtor");
    let debtors = this.state.debtors;
    let total = 0;
    let rowsChecked = 0;
    let rows = debtors.length;
    //Checks whether the a box within our table is checked/unchecked.
    checkboxes.forEach((box) => {
      //If the box is checked. Increments the rowsChecked and total variables.
      if (box.checked) {
        rowsChecked++;
        //Total is incremented by obtaining the balance from checkId function.
        total += this.checkId(box.id);
      }
    });
    //Updates state with current total, rowsChecked, and rows
    this.setState({ total, rowsChecked, rows });
  };

  //Render the component
  render() {
    return (
      <div
        className="App"
        style={{ ...styles.container, justifyContent: "center" }}
      >
        <table>
          {/* Table header */}
          <thead>
            <tr style={{ ...styles.flex }}>
              <td>
                <input
                  type="checkbox"
                  defaultChecked
                  onClick={() => this.toggle()}
                ></input>
              </td>
              <td style={{ ...styles.border, ...styles.row }}>Creditor</td>
              <td style={{ ...styles.border, ...styles.row }}>First Name</td>
              <td style={{ ...styles.border, ...styles.row }}>Last Name</td>
              <td
                style={{ ...styles.border, ...styles.row, ...styles.alignEnd }}
              >
                Min Pay %
              </td>
              <td
                style={{ ...styles.border, ...styles.row, ...styles.alignEnd }}
              >
                Balance
              </td>
            </tr>
          </thead>
          {/* Table Body will be populated with the renderDebtors function. */}
          <tbody>{this.renderDebtors()}</tbody>
        </table>
        <div
          style={{
            ...styles.flex,
            width: "742px",
            justifyContent: "space-between",
          }}
        >
          {/* Button to handle adding a new debt to the table. */}
          <button onClick={() => this.addDebt()}>Add Debt</button>
          {/* Butoon to handle removing a debt from the table */}
          <button onClick={() => this.removeDebt()}>Remove Debt</button>
        </div>
        <div
          style={{
            ...styles.flex,
            width: "742px",
            justifyContent: "space-between",
            background: "lightBlue",
          }}
        >
          {/* Display the Total Balance */}
          <p>
            <b>Total</b>
          </p>
          <p>
            <b>${parseFloat(this.state.total).toFixed(2)}</b>
          </p>
        </div>
        <div
          style={{
            ...styles.flex,
            width: "742px",
            justifyContent: "space-between",
          }}
        >
          {/* Display the total rows of debt */}
          <p>
            <b>Total Row Count {this.state.rows}</b>
          </p>
          {/* Display the current amount of rows that are checked */}
          <p>
            <b>Check Row Count : {this.state.rowsChecked}</b>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
