import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Leave from '../../../../models/Leave'
import { isAuth } from '../../../../utils/auth'
import EActivity from '../../../../utils/EActivity'
import Employee from '../../../../models/Employee'

const handler = nc()

const modelName = 'Leave'
const constants = {
  model: Leave,
  success: `New ${modelName} was created successfully`,
  failed: `New ${modelName} was not created successfully`,
  existed: `New ${modelName} was already existed`,
}

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const employeeId = req.query && req.query.search
  const employee = await Employee.findOne({ employeeId })
  let query = constants.model.find(employee ? { employee: employee._id } : {})
  const total = await constants.model.countDocuments(
    employee ? { employee: employee._id } : {}
  )

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate({
      path: 'employee',
      select: ['employeeId', 'employeeName'],
      populate: {
        path: 'department',
        select: 'name',
      },
    })

  const result = await query

  res.send({
    startIndex: skip + 1,
    endIndex: skip + result.length,
    count: result.length,
    page,
    pages,
    total,
    data: result,
  })
})

handler.post(async (req, res) => {
  await dbConnect()

  const { employee, startDate, endDate, type, reason } = req.body
  const createdBy = req.user.id

  if (endDate <= startDate)
    return res.status(400).send('Start date needs to be from the past')

  const exist = await constants.model.exists({
    employee,
    endDate: { $gt: startDate },
  })

  if (exist) {
    return res
      .status(400)
      .send(
        'You can not process on leave with the selected date. Previous leave does not end'
      )
  }

  const createObj = await constants.model.create({
    employee,
    startDate,
    endDate,
    type,
    reason,
    createdBy,
  })

  if (createObj) {
    EActivity(
      'Leave',
      'Employee scheduled on leave',
      createdBy,
      createObj.employee
    )

    res.status(201).json({ status: constants.success })
  } else {
    return res.status(400).send(constants.failed)
  }
})

export default handler
