import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import { FaFileDownload, FaPenAlt, FaPlus, FaTrash } from 'react-icons/fa'

import useLeaves from '../../api/leaves'
import useEmployees from '../../api/employees'

import { CSVLink } from 'react-csv'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import {
  InputAutoCompleteSelect,
  inputDate,
  inputTextArea,
  staticInputSelect,
} from '../../utils/dynamicForm'
import { useQueryClient } from 'react-query'
import Pagination from '../../components/Pagination'
import moment from 'moment'

const Leave = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { getLeaves, updateLeave, addLeave, deleteLeave } = useLeaves(
    page,
    search
  )

  const { getAllEmployees } = useEmployees()
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('leaves')
    }
    refetch()
  }, [page, queryClient])

  const searchHandler = (e) => {
    e.preventDefault()

    const refetch = async () => {
      await queryClient.prefetchQuery('leaves')
    }
    if (search) {
      refetch()
    }
  }

  const { data, isLoading, isError, error } = getLeaves
  const { data: employeeData } = getAllEmployees

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = updateLeave

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = deleteLeave

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = addLeave

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  useEffect(() => {
    if (isSuccessAdd || isSuccessUpdate) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessAdd, isSuccessUpdate])

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const submitHandler = async (data) => {
    edit
      ? updateMutateAsync({
          _id: id,
          employee: data.employee,
          startDate: data.startDate,
          endDate: data.endDate,
          type: data.type,
          reason: data.reason,
        })
      : addMutateAsync(data)
  }

  const editHandler = (leave) => {
    setId(leave._id)
    setEdit(true)
    setValue('employee', leave.employee._id)
    setValue('startDate', moment(leave.startDate).format('YYYY-MM-DD'))
    setValue('endDate', moment(leave.endDate).format('YYYY-MM-DD'))
    setValue('type', leave.type)
    setValue('reason', leave.reason)
  }

  return (
    <>
      <Head>
        <title>Leaves</title>
        <meta property='og:title' content='Leaves' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Leave has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Leave has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Leave has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}

      <div
        className='modal fade'
        id='editLeaveModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editLeaveModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editLeaveModalLabel'>
                {edit ? 'Edit Leave' : 'Add Leave'}
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
              {isLoading ? (
                <div className='text-center'>
                  <Loader
                    type='ThreeDots'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                </div>
              ) : isError ? (
                <Message variant='danger'>{error}</Message>
              ) : (
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className='row'>
                    <div className='col-md-6 col-12'>
                      {InputAutoCompleteSelect({
                        register,
                        label: 'Employee ID',
                        errors,
                        data: employeeData && employeeData,
                        name: 'employee',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {staticInputSelect({
                        register,
                        label: 'Leave Type',
                        errors,
                        data: [
                          { name: 'Holyday' },
                          { name: 'Maternity' },
                          { name: 'Stick' },
                          { name: 'Unpaid' },
                        ],
                        name: 'type',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputDate({
                        register,
                        label: 'Start Date',
                        errors,
                        name: 'startDate',
                      })}
                    </div>

                    <div className='col-md-6 col-12'>
                      {inputDate({
                        register,
                        label: 'End Date',
                        errors,
                        name: 'endDate',
                      })}
                    </div>
                    <div className='col-12'>
                      {inputTextArea({
                        register,
                        label: 'Reason',
                        errors,
                        name: 'reason',
                      })}
                    </div>
                  </div>

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      disabled={isLoadingAdd || isLoadingUpdate}
                    >
                      {isLoadingAdd || isLoadingUpdate ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='position-relative'>
        <button
          className='btn btn-primary position-fixed rounded-3 animate__bounceIn'
          style={{
            bottom: '20px',
            right: '20px',
          }}
          data-bs-toggle='modal'
          data-bs-target='#editLeaveModal'
        >
          <FaPlus className='mb-1' />
        </button>

        <CSVLink data={data ? data.data : []} filename='leave.csv'>
          <button
            className='btn btn-success position-fixed rounded-3 animate__bounceIn'
            style={{
              bottom: '60px',
              right: '20px',
            }}
          >
            <FaFileDownload className='mb-1' />
          </button>
        </CSVLink>
      </div>

      <div className='row mt-3'>
        <div className='col-md-4 col-6 m-auto'>
          <h3 className='fw-light font-monospace'>Leaves</h3>
        </div>
        <div className='col-md-4 col-6 m-auto'>
          <Pagination data={data} setPage={setPage} />
        </div>

        <div className='col-md-4 col-12 m-auto'>
          <form onSubmit={(e) => searchHandler(e)}>
            <input
              type='text'
              className='form-control py-2'
              placeholder='Search by ID'
              name='search'
              value={search}
              onChange={(e) => (
                setSearch(e.target.value.toUpperCase()), setPage(1)
              )}
              autoFocus
              required
            />
          </form>
        </div>
      </div>

      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='table-responsive '>
            <table className='table table-sm hover bordered table-striped caption-top '>
              <caption>
                {!isLoading && data ? data.total : 0} records were found
              </caption>
              <thead>
                <tr>
                  <th>Emp. ID</th>
                  <th>Emp. Name</th>
                  <th>Department</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((leave) => (
                    <tr key={leave._id}>
                      <td>{leave.employee.employeeId}</td>
                      <td>{leave.employee.employeeName}</td>
                      <td>
                        {leave.employee &&
                          leave.employee.department &&
                          leave.employee.department.name}
                      </td>
                      <td>{moment(leave.startDate).format('ll')}</td>
                      <td>{moment(leave.endDate).format('ll')}</td>

                      <td className='btn-leave'>
                        <button
                          className='btn btn-primary btn-sm rounded-pill '
                          onClick={() => editHandler(leave)}
                          data-bs-toggle='modal'
                          data-bs-target='#editLeaveModal'
                        >
                          <FaPenAlt />
                        </button>

                        <button
                          className='btn btn-danger btn-sm rounded-pill mx-1'
                          onClick={() => deleteHandler(leave._id)}
                          disabled={isLoadingDelete}
                        >
                          {isLoadingDelete ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              <FaTrash />
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Leave)), {
  ssr: false,
})
