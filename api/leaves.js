import dynamicAPI from './dynamicAPI'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const url = '/api/setting/leaves'

export default function useLeaves(page, search) {
  const queryClient = useQueryClient()

  // get all leaves
  const getLeaves = useQuery(
    'leaves',
    async () =>
      await dynamicAPI('get', `${url}?page=${page}&&search=${search}`, {}),
    { retry: 0 }
  )

  // update leaves
  const updateLeave = useMutation(
    async (obj) => await dynamicAPI('put', `${url}/${obj._id}`, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['leaves']),
    }
  )

  // delete leaves
  const deleteLeave = useMutation(
    async (id) => await dynamicAPI('delete', `${url}/${id}`, {}),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['leaves']),
    }
  )

  // add leaves
  const addLeave = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['leaves']),
    }
  )

  return {
    getLeaves,
    updateLeave,
    deleteLeave,
    addLeave,
  }
}
