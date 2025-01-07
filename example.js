const showError = (error) => {
  console.log(error);
};

const divide = (a, b, callback) => {
  if (b === 0) {
    callback("cannot divide by 0");
    return "-";
  }
  const result = a / b;
  return result;
};

console.log(divide(10, 0, showError));

class Database {
  run(sqlQuery, parameterArray, errorCallback) {
    let error = null;
    // run sqlQuery on database with Parameters
    // if the above fails for whatever reason
    error = "above error";

    errorCallback(error);
  }
}

const db = new Database();

db.run("MY SQL HERE", ["param1", "param2"], showError);
