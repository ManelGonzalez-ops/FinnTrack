var assert = require('assert');
<<<<<<< HEAD
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
=======
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            const userId = 22
            const fieldsObj = { imagen: "culo", nacimiento: "hace mucho", gender: "macho" }
            const fieldKeys = Object.keys(fieldsObj)
            const fields = "(" + ["userId", ...fieldKeys] + ")"
            //add extra ? for userId
            const values = "(" + [...Array(fieldKeys.length + 1).fill("?")] + ")";
            const update = fieldKeys.map(key => `${key}=values(${key})`)
            const inputs = fieldKeys.map(key => fieldsObj[key])
            const fin = `insert into userDetails ${fields} values${values} on duplicate key update ${update}`
            const res = "insert into userDetails (userId, imagen, nacimiento, gender) values(?,?,?,?) on duplicate key update image = values(image), nacimiento = values(nacimiento), gender = values(gender)"

            assert.strictEqual(res, fin)
        });
    });
>>>>>>> portfolio-improvements
});