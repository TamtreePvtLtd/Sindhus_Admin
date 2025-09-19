import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import ProductPageDrawer from "../../pageDrawers/ProductDrawer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import { getAllMenusForAddProduct } from "../../services/api";
import {
  useDeleteProduct,
  useGetAllProduct,
  useGetProducts,
  useUpdateAvailability,
  useUpdateHideProduct,
} from "../../customRQHooks/Hooks";
import { useSnackBar } from "../../context/SnackBarContext";
import { IProduct, IProductPageMenuDropDown } from "../../interface/types";
import PaginatedHeader from "../../common/components/PaginatedHeader";

function ProductsPage() {
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [menuData, setMenuData] = useState<IProductPageMenuDropDown[]>([]);
  const [selectedMenuValue, setSelectedMenuValue] =
    useState<IProductPageMenuDropDown | null>(null);
  const [selectedSubmenuValues, setSelectedSubmenuValues] = useState<string[]>(
    []
  );
  const [displayedData, setDisplayedData] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const deleteProductMutation = useDeleteProduct();
  const { updateSnackBarState } = useSnackBar();

  const { data, refetch: refetchProduct } = useGetProducts(
    selectedMenuValue?._id || "",
    selectedSubmenuValues
  );
  const { data: allProduct, refetch } = useGetAllProduct(page, rowsPerPage);
  const updatemutation = useUpdateAvailability();
  const updateHideProduct = useUpdateHideProduct();
   const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (selectedMenuValue === null) {
      setDisplayedData(allProduct?.items || []);
    } else {
      setDisplayedData(data || []);
    }
  }, [selectedMenuValue, allProduct, data]);

  const openDrawer = () => {
    setIsProductDrawerOpen(true);
  };
  const handleDialogclose = () => {
    setIsProductDrawerOpen(false);
    setSelectedProduct(null);
  };
  const handleAddProduct = () => {
    openDrawer();
    setIsAdd(true);
  };
  const handleEditProduct = (product: IProduct) => {
    refetchProduct();
    setSelectedProduct({ ...product });
    openDrawer();
    setIsAdd(false);
  };
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleDeleteDialogOpen = (product: IProduct) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleMenuChange = (event, value) => {
    setSelectedMenuValue(value);
  };

  const getAllMenusData = async () => {
    try {
      const response = await getAllMenusForAddProduct();
      const mappedResponse = response.map((menu) => menu);
      setMenuData(mappedResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMenusData();
    refetch();
  }, [page, rowsPerPage]);

  const clearSearch = () => {
    setSelectedMenuValue(null);
    setSelectedSubmenuValues([]);
  };

  const handleSubmenuChange = (value) => {
    if (selectedSubmenuValues.includes(value)) {
      setSelectedSubmenuValues(
        selectedSubmenuValues.filter((item) => item !== value)
      );
    } else {
      setSelectedSubmenuValues([...selectedSubmenuValues, value]);
    }
  };

  const handleDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct, {
        onSuccess: () => {
          updateSnackBarState(true, "Product removed successfully.", "success");
          setDeleteDialogOpen(false);
        },
        onError: () => {
          updateSnackBarState(true, "Error while remove Product.", "error");
        },
      });
    }
  };

  const handleGetAllProducts = () => {
    clearSearch();
    setPage(1);
    setSelectedMenuValue(null);
    setSelectedSubmenuValues([]);
    refetch();
  };
  
 const handleHideProductChange = async (id, productItem) => {
   const updatedhideProductStatus =
     productItem.hideProduct === "false" ? "true" : "false";
   productItem.hideProduct = updatedhideProductStatus;

   try {
     await updateHideProduct.mutateAsync({
       id,
       hideProduct: updatedhideProductStatus,
     });
     refetch();
     updateSnackBarState(true, "Product Visibility updated successfully.", "success");
   } catch (error) {
     productItem.hideProduct =
       updatedhideProductStatus === "true" ? "false" : "true";
     updateSnackBarState(true, "Failed to update Visibility status.", "error");
   }
  };
  
  const handleSwitchChange = async (id, productItem) => {
    const updatedAvailabilityStatus =
      productItem.availability === "true" ? "false" : "true";

    // Optimistically update the UI
    productItem.availability = updatedAvailabilityStatus;

    try {
      await updatemutation.mutateAsync({
        id,
        availability: updatedAvailabilityStatus,
      });
      refetch();
      updateSnackBarState(
        true,
        "Availability updated successfully.",
        "success"
      );
    } catch (error) {
      // Revert the optimistic update if the request fails
      productItem.availability = updatedAvailabilityStatus === "true" ? "false" : "true";
      updateSnackBarState(
        true,
        "Failed to update availability status.",
        "error"
      );
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 1, sm: 2 },
        marginLeft: { xs: "10px", md: "40px" },
        marginRight: { xs: "10px", md: "40px" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
          }}
        >
          <Autocomplete
            id="combo-box-demo"
            options={menuData || []}
            getOptionLabel={(option) => option.title}
            value={selectedMenuValue}
            onChange={handleMenuChange}
            sx={{
              width: { xs: "100%", sm: 300 },
              marginBottom: { xs: 2, md: 0 },
              marginRight: { md: 2 },
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Menu" size="small" />
            )}
          />

          <Box ml={2} sx={{ display: { xs: "none", sm: "block" } }}>
            {selectedMenuValue &&
              selectedMenuValue.subMenus.length > 0 &&
              selectedMenuValue.subMenus.map((data, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedSubmenuValues.includes(data._id)}
                      onChange={() => handleSubmenuChange(data._id)}
                    />
                  }
                  label={data.title}
                  key={index}
                />
              ))}
          </Box>

          <Box
            ml={2}
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems="center"
          >
            {selectedMenuValue === null && (
              <PaginatedHeader
                pagetitle="product"
                pageInfo={allProduct?.pageInfo}
                onRowsPerPageChange={setRowsPerPage}
                onPageChange={setPage}
              />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            mt: { xs: 2, sm: 0 },
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={clearSearch}
            sx={{
              color: "#038265",
              marginBottom: { xs: 1, sm: 0 },
              marginRight: { sm: 1 },
            }}
          >
            Clear Search
          </Button>
          {/* <Button
            variant="outlined"
            size="small"
            onClick={handleGetAllProducts}
            sx={{ color: "#038265" }}
          >
            All
          </Button> */}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct}
          sx={{ width: { xs: "60%", sm: "auto" } }}
        >
          + Add Product
        </Button>
      </Box>

      <Box mt={2}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "10%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Image
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "10%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Availability
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "10%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Hide Product
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "15%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Title
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "20%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Description
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "10%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Price
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "17%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Catering Size-Price
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "17%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    DailyMenu Size-Price
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: "bolder",
                    fontSize: "large",
                    width: "10%",
                    background: (theme) => theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    align="center"
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData &&
                displayedData.length > 0 &&
                displayedData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" sx={{ textAlign: "left" }}>
                      <img
                        src={
                          typeof item.posterURL === "string"
                            ? item.posterURL
                            : undefined
                        }
                        alt={item.title}
                        height="50px"
                        width="50px"
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item?.availability === "true"}
                        onChange={() => handleSwitchChange(item._id, item)}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={item?.hideProduct === "true"}
                        onChange={() => handleHideProductChange(item._id, item)}
                        color="primary"
                        inputProps={{ "aria-label": "Hide Product" }}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ textAlign: "left", fontWeight: 600 }}
                    >
                      {item.title}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        textAlign: "left",
                        maxWidth: "50px",
                        fontWeight: 600,
                      }}
                    >
                      {item.description}
                    </TableCell>
                    <TableCell style={{ textAlign: "left", fontWeight: 600 }}>
                      {item.itemSizeWithPrice &&
                        item.itemSizeWithPrice.length > 0 &&
                        item.itemSizeWithPrice.map((qty, index) => (
                          <Box key={index}>
                            <>
                              {qty.size} - ${qty.price}
                            </>
                          </Box>
                        ))}
                    </TableCell>

                    <TableCell style={{ textAlign: "left", fontWeight: 600 }}>
                      {item.cateringMenuSizeWithPrice.length > 0 &&
                        item.cateringMenuSizeWithPrice.map((qty, index) => (
                          <>
                            <Box key={index}>
                              <>
                                {qty.size} - ${qty.price}
                              </>
                            </Box>
                            {index <
                              item.cateringMenuSizeWithPrice.length - 1 && (
                              <Divider />
                            )}
                          </>
                        ))}
                    </TableCell>
                    <TableCell style={{ textAlign: "left", fontWeight: 600 }}>
                      {item.dailyMenuSizeWithPrice.length > 0 &&
                        item.dailyMenuSizeWithPrice.map((qty, index) => (
                          <>
                            <Box key={index}>
                              <>
                                {qty.size} - ${qty.price}
                              </>
                            </Box>
                            {index < item.dailyMenuSizeWithPrice.length - 1 && (
                              <Divider />
                            )}
                          </>
                        ))}
                    </TableCell>

                    <TableCell align="left" sx={{ textAlign: "left" }}>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <IconButton>
                          <EditIcon onClick={() => handleEditProduct(item)} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteDialogOpen(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {deleteDialogOpen && (
        <CommonDeleteDialog
          title="Delete Product"
          content="Are You Sure Want To Delete The Product?"
          dialogOpen={deleteDialogOpen}
          onDialogclose={() => setDeleteDialogOpen(false)}
          onDelete={handleDelete}
        />
      )}
      {isProductDrawerOpen && (
        <ProductPageDrawer
          selectedProduct={selectedProduct}
          dialogOpen={isProductDrawerOpen}
          onCloseDialog={handleDialogclose}
          isAdd={isAdd}
        />
      )}
    </Box>
  );
}

export default ProductsPage;
