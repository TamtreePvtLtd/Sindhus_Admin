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
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import PaginatedHeader from "../../common/components/PaginatedHeader";
import { useSnackBar } from "../../context/SnackBarContext";
import { useTheme } from "@mui/material/styles";
import DistanceDrawer from "../../pageDrawers/DistanceDrawer";
import {
  useDeleteDistanceBasedCharge,
  useGetDistanceBasedDeliveryCharge,
} from "../../customRQHooks/Hooks";
import { DistanceBasedDeliveryCharge } from "../../interface/snacks";

function Distance() {
  const [selectedDistance, setSelectedDistance] = useState<any | null>(null);
  const [distanceDrawerOpen, setDistanceDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [distanceBasedCharge, setDistanceBasedCharge] =
    useState<DistanceBasedDeliveryCharge[]>();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const { updateSnackBarState } = useSnackBar();
  const { data: distance, refetch } = useGetDistanceBasedDeliveryCharge();
  const deleteDistanceMutation = useDeleteDistanceBasedCharge();

  useEffect(() => {
    if (distance) {
      setDistanceBasedCharge(distance);
    }
  }, [distance]);

  const handleDistanceDrawerclose = () => {
    setDistanceDrawerOpen(false);
  };

  const handleEditCoupen = (coupen: any) => {
    setSelectedDistance({ ...coupen });
    setDistanceDrawerOpen(true);
  };

  const handleAddDistanceClick = () => {
    setSelectedDistance(null);
    setDistanceDrawerOpen(true);
  };

  const handleDelete = (coupen: any) => {
    setSelectedDistance(coupen);
    setDeleteDialogOpen(true);
  };

  const onDelete = async () => {
    try {
      if (selectedDistance && selectedDistance._id) {
        await deleteDistanceMutation.mutateAsync(selectedDistance._id, {
          onSuccess: () => {
            updateSnackBarState(
              true,
              "Distance removed successfully.",
              "success"
            );
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
          pagetitle="Distance"
          pageInfo={{
            totalPages: 1,
            totalItems:
              (distanceBasedCharge && distanceBasedCharge?.length) || 0,
            page,
            pageSize: 10,
          }}
          onRowsPerPageChange={setRowsPerPage}
          onPageChange={setPage}
          onAddClick={handleAddDistanceClick}
          addButtonText={" + Add Distance"}
        />
        <Grid item xs={12}>
          <TableContainer elevation={0} component={Paper}>
            <Table
              stickyHeader
              aria-label="menus-table"
              sx={{ width: "100%", alignItems: "center" }}
            >
              <TableHead className="table-header">
                <TableRow className="table-header-row">
                  <TableCell
                    sx={{
                      // width: "20%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Upto Miles
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      // width: "15%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Amount
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      // width: "10%",
                      textAlign: "center",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {distance &&
                  distance.length > 0 &&
                  distance.map((distance) => (
                    <TableRow key={distance._id}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {distance.uptoDistance}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        {distance.amount}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: 600 }}>
                        <IconButton>
                          <EditIcon
                            onClick={() => handleEditCoupen(distance)}
                          />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon onClick={() => handleDelete(distance)} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
      {distanceDrawerOpen && (
        <DistanceDrawer
          selectedDistance={selectedDistance}
          drawerOpen={distanceDrawerOpen}
          handleDrawerClose={handleDistanceDrawerclose}
          refetch={refetch}
          distance={distanceBasedCharge || []}
        />
      )}
      {deleteDialogOpen && (
        <CommonDeleteDialog
          title="Delete Distance"
          content="Are you sure you want to delete the distance?"
          dialogOpen={deleteDialogOpen}
          onDialogclose={() => setDeleteDialogOpen(false)}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

export default Distance;
