import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Leave from '../../../../models/Leave'
import { isAuth } from '../../../../utils/auth'
import EActivity from '../../../../utils/EActivity'

const handler = nc()

const modelName = 'Leave'
const constants = {
  model: Leave,
  success: `${modelName} was updated successfully`,
  failed: `${modelName} was not updated successfully`,
  existed: `${modelName} was already existed`,
}

handler.use(isAuth)
handler.put(async (req, res) => {
  await dbConnect()

  const { employee, startDate, endDate, type, reason } = req.body
  const _id = req.query.id
  const updatedBy = req.user.id

  const obj = await constants.model.findById(_id)

  if (obj) {
    if (endDate <= startDate)
      return res.status(400).send('Start date needs to be from the past')

    const exist = await constants.model.exists({
      _id: { $ne: _id },
      employee,
      endDate: { $gt: startDate },
    })
    if (!exist) {
      obj.employee = employee
      obj.startDate = startDate
      obj.endDate = endDate
      obj.type = type
      obj.reason = reason
      obj.updatedBy = updatedBy
      await obj.save()
      EActivity('Modification', 'Leave has updated', updatedBy, obj.employee)

      res.json({ status: constants.success })
    } else {
      return res
        .status(400)
        .send(
          'You can not process on leave with the selected date. Previous leave does not end'
        )
    }
  } else {
    return res.status(404).send(constants.failed)
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await constants.model.findById(_id)
  if (!obj) {
    return res.status(404).send(constants.failed)
  } else {
    await obj.remove()

    res.json({ status: constants.success })
  }
})

export default handler
