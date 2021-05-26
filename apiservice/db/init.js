const {
  createUserTable, addNewUser, findUser, addOperation, createOperationTable, getOperations, addCompanyInfo, getCompanyInfo, createCompanyInfo, createCompaniesJsonTable, getMostActives, storeMostActives, deletePreviousDateRecord, createPortfolioTable,getMaxConections
} = require("./services");
const { createInterestTable } = require("./services/interestsService");
const { createPostRegister, createPostStructure } = require("./services/PostServices");
const { createUserDetails } = require("./services/UserService");


const initDb = async() => {
  await getMaxConections();
  await createUserTable();
  await createOperationTable();
  await createCompanyInfo();
  await createCompaniesJsonTable();
  await createPortfolioTable();
  await createInterestTable();
  await createPostRegister();
  await createPostStructure();
  await createUserDetails();
};

module.exports = { initDb };
