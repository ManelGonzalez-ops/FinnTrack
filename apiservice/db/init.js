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
  await createCompanyInfo();
  await createCompaniesJsonTable();
  await createPortfolioTable();
  await createInterestTable();
  await createPostRegister();
  await createPostStructure();
  console.log("done3")
  await createUserDetails();
};

module.exports = { initDb };
