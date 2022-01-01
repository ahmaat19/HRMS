import dynamicAPI from './dynamicAPI'
import { useMutation, useQueryClient } from 'react-query'

const url = '/api/admin/employee-activities'

export default function useEmployeeActivities() {
  const queryClient = useQueryClient()

  // add employees
  const addEmployeeActivity = useMutation(
    async (obj) => await dynamicAPI('post', url, obj),
    {
      retry: 0,
      onSuccess: () => queryClient.invalidateQueries(['employees']),
    }
  )

  return {
    addEmployeeActivity,
  }
}
