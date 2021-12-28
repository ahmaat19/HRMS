import React from 'react'
import { useRouter } from 'next/router'

const PositionTransfer = () => {
  const router = useRouter()
  const { id } = router.query
  const employeeId = id[0]
  const positionId = id[1]

  console.log({ employeeId, positionId })
  return <div>Position Transfer</div>
}

export default PositionTransfer
