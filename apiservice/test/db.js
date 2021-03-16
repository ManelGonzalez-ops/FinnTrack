
var assert = require('assert');
 const { getAllUsers } = require('../../db/services');
// describe('test left join', function () {
//     it('works', async function () {
//         console.log(getAllUsers)
//         const users = await getAllUsers()
//         console.log(users)
//         assert.strictEqual(users, {})

//     })
// })


getAllUsers().then(res=>console.log(res))