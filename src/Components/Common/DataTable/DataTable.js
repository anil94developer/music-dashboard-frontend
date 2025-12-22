
import React, { useEffect, useState } from 'react'
import { endpoint } from '../../../Constants/Data.constant'
import { getData, postData, putData } from '../../../Services/Ops'
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useUserProfile } from '../../../Context/UserProfileContext';
  
export default function DataTable(props) {
    const {columns, height,width='100%',rows,checkboxSelection=false,columnNo=10}=props;
    const { userProfile } = useUserProfile();
    const paginationModel = { page: 0, pageSize: columnNo };

    // Unified styles for all DataTables - Same color and format across all roles
    const getTableStyles = () => {
      return {
        border: 'none',
        borderRadius: '0',
        width: width,
        backgroundColor: '#ffffff',
        color: '#333333',
        '& .MuiDataGrid-cell': {
          backgroundColor: '#ffffff',
          color: '#333333',
          fontSize: '14px',
          borderBottom: '1px solid #9e9e9e',
          borderRight: '1px solid #9e9e9e',
          padding: '8px 16px',
          '&:last-of-type': {
            borderRight: 'none',
          },
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          }
        },
        '& .MuiDataGrid-columnHeaderCheckbox': {
          display: checkboxSelection ? 'flex' : 'none !important',
        },
        '& .MuiDataGrid-cellCheckbox': {
          display: checkboxSelection ? 'flex' : 'none !important',
        },
        '& .MuiDataGrid-columnHeader': {
          backgroundColor: '#1e3c72',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center',
          borderRight: '1px solid #9e9e9e',
          borderBottom: '1px solid #9e9e9e',
          padding: '8px 16px',
          minHeight: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:last-of-type': {
            borderRight: 'none',
          },
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          }
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#1e3c72',
          color: '#ffffff',
          fontWeight: 700,
          borderBottom: '2px solid #9e9e9e',
          borderTop: '1px solid #9e9e9e',
          borderLeft: '1px solid #9e9e9e',
          borderRight: '1px solid #9e9e9e',
          minHeight: '52px !important',
          maxHeight: 'none !important',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 700,
          fontSize: '14px',
          overflow: 'visible',
          textOverflow: 'clip',
          whiteSpace: 'normal',
          lineHeight: '1.5',
          color: '#ffffff',
          display: 'block',
          width: '100%',
          textAlign: 'center',
        },
        '& .MuiDataGrid-columnHeaderTitleContainer': {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '& .MuiDataGrid-row': {
          backgroundColor: '#ffffff',
          '&:hover': {
            backgroundColor: '#f0f7ff !important',
            cursor: 'pointer',
          },
          '&.Mui-selected': {
            backgroundColor: '#e3f2fd !important',
            '&:hover': {
              backgroundColor: '#bbdefb !important',
            }
          }
        },
        '& .MuiDataGrid-footerContainer': {
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #9e9e9e',
          color: '#333333 !important',
        },
        '& .MuiTablePagination-root': {
          color: '#333333 !important',
        },
        '& .MuiTablePagination-displayedRows': {
          color: '#333333 !important',
          fontSize: '14px',
          fontWeight: 500,
        },
        '& .MuiTablePagination-selectLabel': {
          color: '#333333 !important',
          fontSize: '14px',
          marginRight: '8px',
        },
        '& .MuiTablePagination-toolbar': {
          color: '#333333 !important',
          minHeight: '52px',
          padding: '0 8px',
        },
        '& .MuiIconButton-root': {
          color: '#333333 !important',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '&.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.26) !important',
          }
        },
        '& .MuiSelect-select': {
          color: '#333333 !important',
          backgroundColor: '#ffffff',
          padding: '4px 32px 4px 12px',
          fontSize: '14px',
        },
        '& .MuiSelect-icon': {
          color: '#333333 !important',
        },
        '& .MuiInputBase-root': {
          color: '#333333 !important',
          fontSize: '14px',
        },
        '& .MuiTablePagination-select': {
          color: '#333333 !important',
        }
      };
    };

    return ( 
        <Paper sx={{ 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          width: '100%',
          height: height || 'auto',
          border: '1px solid #9e9e9e',
        }}>
            <Box sx={{ 
              width: '100%', 
              height: height || '600px',
              overflow: 'auto',
              '& .MuiDataGrid-root': {
                width: '100%',
                border: 'none',
              },
              '& .MuiDataGrid-main': {
                border: 'none',
              },
              '@media (max-width: 768px)': {
                '& .MuiTablePagination-toolbar': {
                  flexWrap: 'wrap',
                  gap: '8px',
                },
                '& .MuiTablePagination-displayedRows': {
                  fontSize: '12px',
                },
                '& .MuiTablePagination-selectLabel': {
                  fontSize: '12px',
                },
              },
              '@media (max-width: 576px)': {
                '& .MuiTablePagination-toolbar': {
                  padding: '4px',
                },
                '& .MuiTablePagination-displayedRows': {
                  fontSize: '11px',
                  margin: '0 4px',
                },
                '& .MuiTablePagination-selectLabel': {
                  fontSize: '11px',
                  marginRight: '4px',
                },
                '& .MuiIconButton-root': {
                  padding: '4px',
                },
                '& .MuiSelect-select': {
                  padding: '2px 24px 2px 8px',
                  fontSize: '12px',
                }
              }
            }}>
            <DataGrid
                rows={rows}
                columns={columns}
                  getRowId={(row) => row._id || row.id || row.clientNumber || Math.random()}
                initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10, 20, 50, 70, 100]}
                checkboxSelection={checkboxSelection}
                  disableRowSelectionOnClick={!checkboxSelection}
                sx={{
                    ...getTableStyles(),
                    '& .MuiDataGrid-columnHeaderCheckbox': {
                      display: checkboxSelection ? 'flex' : 'none !important',
                      width: checkboxSelection ? '56px' : '0px !important',
                      minWidth: checkboxSelection ? '56px' : '0px !important',
                      maxWidth: checkboxSelection ? '56px' : '0px !important',
                        },
                    '& .MuiDataGrid-cellCheckbox': {
                      display: checkboxSelection ? 'flex' : 'none !important',
                      width: checkboxSelection ? '56px' : '0px !important',
                      minWidth: checkboxSelection ? '56px' : '0px !important',
                      maxWidth: checkboxSelection ? '56px' : '0px !important',
                    },
                    '& .MuiDataGrid-columnHeader:empty': {
                      display: 'none !important',
                    },
                    '& .MuiDataGrid-cell:empty': {
                      display: 'none !important',
                    },
                    '& .MuiDataGrid-filler': {
                      display: 'none !important',
                      width: '0px !important',
                      minWidth: '0px !important',
                      maxWidth: '0px !important',
                      padding: '0 !important',
                    },
                    '& .MuiDataGrid-columnHeader:last-of-type': {
                      borderRight: 'none !important',
                    },
                    '& .MuiDataGrid-cell:last-of-type': {
                      borderRight: 'none !important',
                    },
                    '& .MuiDataGrid-columnHeader[data-field="__empty__"]': {
                      display: 'none !important',
                    },
                    '& .MuiDataGrid-cell[data-field="__empty__"]': {
                      display: 'none !important',
                    },
                  }}
                  autoHeight={!height}
                  {...(height && { height: height })}
                  pagination
                  disableColumnMenu={false}
                  disableColumnFilter={false}
                  disableColumnSelector={false}
                  hideFooterSelectedRowCount={true}
                  disableExtendRowFullWidth={true}
                  slots={{
                    noRowsOverlay: () => null,
                    noResultsOverlay: () => null,
                  }}
            />
            </Box>
        </Paper>
    )
} 