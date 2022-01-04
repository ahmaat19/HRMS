import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Employee from '../../../models/Employee'
import { isAuth } from '../../../utils/auth'

const handler = nc()

const modelName = 'Employee'
const constants = {
  model: Employee,
  success: `New ${modelName} was created successfully`,
  failed: `New ${modelName} was not created successfully`,
  existed: `New ${modelName} was already existed`,
}

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()
  const employees = await constants.model.find(
    { isActive: true },
    { employeeId: 1, employeeName: 1 }
  )

  res.send(employees)
})

export default handler
