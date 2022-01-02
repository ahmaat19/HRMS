import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import EmployeeActivity from '../../../models/EmployeeActivity'
import Employee from '../../../models/Employee'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.post(async (req, res) => {
  await dbConnect()
  const employeeId = req.body

  const employee = await Employee.findOne({ employeeId })
  if (employee) {
    let query = EmployeeActivity.find({ employee: employee._id })
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 1
    const skip = (page - 1) * pageSize
    const total = await EmployeeActivity.countDocuments({
      employee: employee._id,
    })
    const pages = Math.ceil(total / pageSize)

    // const obj = await EmployeeActivity.find({ employee: employee._id })
    // .sort({ createdAt: -1 })
    // .skip(skip)
    // .limit(pageSize)
    // .populate('employee')
    // .populate('doneBy', ['name'])
    query = query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('employee')
      .populate('doneBy', ['name'])
    const result = await query

    res.status(200).send({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })

    // res.status(200).send(obj)
  } else {
    return res
      .status(400)
      .send(`Sorry. The ${employeeId} employee ID were not found!`)
  }
})

export default handler
