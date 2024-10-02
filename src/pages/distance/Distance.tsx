import { useState } from "react";
import { Box, Typography, Grid, IconButton, Switch } from "@mui/material";
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

function Distance() {
  const [selectedDistance, setSelectedDistance] = useState<any | null>(null);
  const [distanceDrawerOpen, setDistanceDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const { updateSnackBarState } = useSnackBar();

  // Seed data for up to miles and amount
  const seedData = [
    { _id: "1", uptoMiles: "5 Miles", amount: "$10" },
    { _id: "2", uptoMiles: "10 Miles", amount: "$20" },
    { _id: "3", uptoMiles: "15 Miles", amount: "$30" },
  ];

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
        // Filter out the deleted coupen
        const updatedCoupens = seedData.filter(
          (item) => item._id !== selectedDistance._id
        );
        updateSnackBarState(true, "Menu removed successfully.", "success");
        setDeleteDialogOpen(false);
        console.log("Updated coupens: ", updatedCoupens);
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
            totalItems: seedData.length,
            page,
          }}
          onRowsPerPageChange={setRowsPerPage}
          onPageChange={setPage}
          onAddClick={handleAddDistanceClick}
          addButtonText={" + Add Discount"}
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
                      width: "20%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      UptoMiles
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Amount
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "10%",
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
                {seedData.length > 0 &&
                  seedData.map((coupen) => (
                    <TableRow key={coupen._id}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {coupen.uptoMiles}
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: 600 }}>
                        {coupen.amount}
                      </TableCell>
                      <TableCell>
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
      {distanceDrawerOpen && (
        <DistanceDrawer
          selectedDistance={selectedDistance}
          drawerOpen={distanceDrawerOpen}
          handleDrawerClose={handleDistanceDrawerclose}
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
