const { sqlForPartialUpdate } = require('./sql');

describe('I still dont know what it does', function() {
  test('should do partial update', function() {
    const result = sqlForPartialUpdate({name: "DBS cars", num_employees: 21}, {
      name: 'name',
      num_employees: 'num_employees'
    })
    expect(result).toEqual({
      setCols: '"name"=$1, "num_employees"=$2',
      values: ['DBS cars', 21]
    })
  })

  test('should return an error', function() {
    expect(() => sqlForPartialUpdate({})).toThrowError('No data')
  })
})
