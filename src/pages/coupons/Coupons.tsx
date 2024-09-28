import { useEffect, useState } from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ICoupen } from "../../interface/menus";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import { useDeleteCoupen, useGetAllCoupens } from "../../customRQHooks/Hooks";
import PaginatedHeader from "../../common/components/PaginatedHeader";
import { useSnackBar } from "../../context/SnackBarContext";
import { useTheme } from "@mui/material/styles";
import CouponsDrawe from "../../pageDrawers/CouponsDrawer";

function Coupons() {
  const [selectedCoupen, setSelectedCoupen] = useState<ICoupen | null>(null);
  const [coupenDrawerOpen, setCoupenDrawerOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { data: coupens, refetch } = useGetAllCoupens(page, rowsPerPage);

  const deleteCoupenMutation = useDeleteCoupen();
    const { updateSnackBarState } = useSnackBar();
    const theme = useTheme();
  
    useEffect(() => {
      refetch();
    }, [page, rowsPerPage]);
  
  const handleCoupenDrawerclose = () => {
    setCoupenDrawerOpen(false);
    };
  
  const handleEditCoupen = (coupen: ICoupen) => {
    setSelectedCoupen({ ...coupen });
    setCoupenDrawerOpen(true);
    };
  const handleAddCoupenClick = () => {
    setSelectedCoupen(null);
    setCoupenDrawerOpen(true);
    };
  
  const handleDelete = (coupen: ICoupen) => {
    setSelectedCoupen(coupen);
      setDeleteDialogOpen(true);
    };
  
    const onDelete = async () => {
      try {
        if (selectedCoupen && selectedCoupen._id) {
          await deleteCoupenMutation.mutateAsync(selectedCoupen._id, {
            onSuccess: () => {
              updateSnackBarState(true, "Menu removed successfully.", "success");
            },
            onError: () => {
              updateSnackBarState(true, "Error while remove category.", "error");
            },
          });
          setDeleteDialogOpen(false);
        } else {
          console.error("Invalid selectedCoupen or _id");
        }
      } catch (error) {
        console.error("Error deleting Coupen:", error);
      }
    };
  
  
  return (
    <>
      <Box paddingX={"20px"} justifyContent="space-between" alignItems="center">
        <PaginatedHeader
          pagetitle="Coupens"
          pageInfo={coupens?.pageInfo}
          onRowsPerPageChange={setRowsPerPage}
          onPageChange={setPage}
          onAddClick={handleAddCoupenClick}
          addButtonText={" + Add Coupons"}
        />
        <Grid item xs={12}>
          <TableContainer
            elevation={0}
            component={Paper}
          >
            <Table stickyHeader aria-label="menus-table" >
              <TableHead className='table-header'>
                <TableRow className='table-header-row'>

                  <TableCell
                    sx={{
                     width: "20%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      CoupenName
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      // textAlign: "center",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      CoupenType
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      // textAlign: "left",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      DiscountAmount
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                        width: "10%",

                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      MinAmount
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                        width: "10%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      MaxAmount
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                        width: "20%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      Availability
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      // textAlign: "center",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupens?.items &&
                  coupens?.items.length > 0 &&
                  coupens?.items.map((coupen) => (
                    <TableRow key={coupen._id}>
                      <TableCell sx={{ fontWeight: 600 }}>{coupen.coupenName}</TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: 600 }}>
                        {coupen.coupenType}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: 600 }}>
                        {coupen.discountAmount}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: 600 }}>
                        {coupen.minAmount}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: 600 }}>
                        {coupen.maxAmount}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: 600 }}>
                        {coupen.availability}
                      </TableCell>


                      <TableCell >
                        <IconButton>
                          <EditIcon onClick={() => handleEditCoupen(coupen)} />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon onClick={() => handleDelete(coupen)} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody> 
            </Table>
          </TableContainer>
        </Grid>

      </Box>
      {coupenDrawerOpen && (
        <CouponsDrawe
          menuDrawerOpen={coupenDrawerOpen}
          handleMenuDrawerclose={handleCoupenDrawerclose}
        />
      )}
      {deleteDialogOpen && (
        <CommonDeleteDialog
          title="Delete Menu"
          content="Are you sure you want to delete the Menu?"
          dialogOpen={deleteDialogOpen}
          onDialogclose={() => setDeleteDialogOpen(false)}
          onDelete={onDelete}
        />
      )}
    </>  )
}

export default Coupons