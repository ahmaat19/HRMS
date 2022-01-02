import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import UserLogon from '../../../../models/UserLogon'
import { isAuth, isAdmin } from '../../../../utils/auth'
import User from '../../../../models/User'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await dbConnect()

  const email = req.query && req.query.search && req.query.search.toLowerCase()
  const users = await User.findOne({ email })

  let query = UserLogon.find(email && users ? { user: users._id } : {})
  const total = await UserLogon.countDocuments(
    email && users ? { user: users._id } : {}
  )

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 2
  const skip = (page - 1) * pageSize

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate('user', ['name', 'email'])

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

export default handler
