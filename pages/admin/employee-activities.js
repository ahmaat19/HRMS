import React, { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import { FaFileDownload } from 'react-icons/fa'
import useEmployeeActivities from '../../api/employeeActivities'
import { CSVLink } from 'react-csv'
import moment from 'moment'

const Activities = () => {
  const [search, setSearch] = useState('')
  const { addEmployeeActivity } = useEmployeeActivities()

  const { isLoading, isError, error, isSuccess, mutateAsync, data } =
    addEmployeeActivity

  const searchHandler = (e) => {
    e.preventDefault()
    mutateAsync(search)
  }

  const forExcel =
    data &&
    data.map((d) => ({
      EmployeeID: d.employee.employeeId,
      Name: d.employee.employeeName,
      ActionType: d.type,
      Description: d.description,
      DateTime: moment(d.createdAt).format('lll'),
      DoneBy: d.doneBy.name,
    }))

  return (
    <>
      <Head>
        <title>Employee</title>
        <meta property='og:title' content='Employee' key='title' />
      </Head>
      {isSuccess && (
        <Message variant='success'>
          Employee activity has been fetched successfully.
        </Message>
      )}
      {isError && <Message variant='danger'>{error}</Message>}

      <div className='position-relative'>
        <CSVLink data={data ? forExcel : []} filename='employee activities.csv'>
          <button
            className='btn btn-success position-fixed rounded-3 animate__bounceIn'
            style={{
              bottom: '20px',
              right: '20px',
            }}
          >
            <FaFileDownload className='mb-1' />
          </button>
        </CSVLink>
      </div>

      <div className='row mt-3'>
        <div className='col-md-4 col-6 me-auto'>
          <h3 className='fw-light font-monospace'>Employee Activities</h3>
        </div>

        <div className='col-md-4 col-12 ms-auto'>
          <form onSubmit={(e) => searchHandler(e)}>
            <input
              type='text'
              className='form-control py-2'
              placeholder='Search by ID or Name'
              name='search'
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
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
                {!isLoading && data ? data.length : 0} records were found
              </caption>
              <thead>
                <tr>
                  <th>Emp. ID</th>
                  <th>Emp. Name</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>DateTime</th>
                  <th>Done By</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.employee.employeeId}</td>
                      <td>{employee.employee.employeeName}</td>
                      <td>{employee.type}</td>
                      <td>{employee.description}</td>
                      <td>{moment(employee.createdAt).format('lll')}</td>
                      <td>{employee.doneBy.name}</td>
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

export default dynamic(() => Promise.resolve(withAuth(Activities)), {
  ssr: false,
})
