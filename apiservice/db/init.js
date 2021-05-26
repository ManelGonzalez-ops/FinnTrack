const {
  createUserTable, addNewUser, findUser, addOperation, createOperationTable, getOperations, addCompanyInfo, getCompanyInfo, createCompanyInfo, createCompaniesJsonTable, getMostActives, storeMostActives, deletePreviousDateRecord, createPortfolioTable,getMaxConections
} = require("./services");
const { createInterestTable } = require("./services/interestsService");
const { createPostRegister, createPostStructure } = require("./services/PostServices");
const { createUserDetails } = require("./services/UserService");


const initDb = async() => {
  await getMaxConections();
  console.log("done1")
  await createUserTable();
  console.log("done2")
  await createOperationTable();
  console.log("done3")
  await createCompanyInfo();
  console.log("done4")
  await createCompaniesJsonTable();
  console.log("done5")
  await createPortfolioTable();
  console.log("done6")
  await createInterestTable();
  console.log("done7")
  await createPostRegister();
  console.log("done8")
  await createPostStructure();
  console.log("done9")
  await createUserDetails();
};

module.exports = { initDb };
