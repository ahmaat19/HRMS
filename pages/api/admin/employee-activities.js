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
  console.log(req.body)
  const employee = await Employee.findOne({ employeeId })
  if (employee) {
    const obj = await EmployeeActivity.find({ employee: employee._id })
      .sort({ createdAt: -1 })
      .populate('employee')
      .populate('doneBy', ['name'])
    res.status(200).send(obj)
  } else {
    return res
      .status(400)
      .send(`Sorry. The ${employeeId} employee ID were not found!`)
  }
})

export default handler
