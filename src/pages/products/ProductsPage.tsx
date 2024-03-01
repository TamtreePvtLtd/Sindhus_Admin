import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ProductPageDrawer from "../../pageDrawers/ProductDrawer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDeleteDialog from "../../common/components/CommonDeleteDialog";
import { getAllMenusForAddProduct } from "../../services/api";
import { useDeleteProduct, useGetProducts } from "../../customRQHooks/Hooks";
import { useSnackBar } from "../../context/SnackBarContext";
import { IProduct, IProductPageMenuDropDown } from "../../interface/types";

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

  const deleteProductMutation = useDeleteProduct();
  const { updateSnackBarState } = useSnackBar();

  const { data } = useGetProducts(
    selectedMenuValue?._id || "",
    selectedSubmenuValues
  );

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
  }, []);

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

  return (
    <>
      <Container sx={{ py: 2 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom component="div">
            Products
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
          >
            + Add Product
          </Button>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Autocomplete
            id="combo-box-demo"
            options={menuData || []}
            getOptionLabel={(option) => option.title}
            value={selectedMenuValue}
            onChange={handleMenuChange}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Menu" size="small" />
            )}
          />
          <Box ml={2}>
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
          <Button variant="outlined" size="small" onClick={clearSearch}>
            Clear Search
          </Button>
        </Box>
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bolder",
                      fontSize: "large",
                      width: "10%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      Image
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bolder",
                      fontSize: "large",
                      width: "15%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      Title
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bolder",
                      fontSize: "large",
                      width: "20%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      Description
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bolder",
                      fontSize: "large",
                      width: "10%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      Price
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bolder",
                      fontSize: "large",
                      width: "17%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      Catering Size-Price
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bolder",
                      fontSize: "large",
                      width: "17%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      DailyMenu Size-Price
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bolder",
                      fontSize: "large",
                      width: "10%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.length > 0 &&
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="right" sx={{ textAlign: "center" }}>
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
                      <TableCell align="right" sx={{ textAlign: "center" }}>
                        {item.title}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          textAlign: "left",
                          maxWidth: "50px",
                        }}
                      >
                        {item.description}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {item.itemSizeWithPrice &&
                          item.itemSizeWithPrice.length > 0 &&
                          item.itemSizeWithPrice.map((qty, index) => (
                            <Box key={index} m={1}>
                              <>
                                {qty.size} - ${qty.price}
                              </>
                            </Box>
                          ))}
                      </TableCell>

                      <TableCell style={{ textAlign: "center" }}>
                        {item.cateringMenuSizeWithPrice.length > 0 &&
                          item.cateringMenuSizeWithPrice.map((qty, index) => (
                            <>
                              <Box key={index} m={1}>
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
                      <TableCell style={{ textAlign: "center" }}>
                        {item.dailyMenuSizeWithPrice.length > 0 &&
                          item.dailyMenuSizeWithPrice.map((qty, index) => (
                            <>
                              <Box key={index} m={1}>
                                <>
                                  {qty.size} - ${qty.price}
                                </>
                              </Box>
                              {index <
                                item.dailyMenuSizeWithPrice.length - 1 && (
                                <Divider />
                              )}
                            </>
                          ))}
                      </TableCell>

                      <TableCell align="right" sx={{ textAlign: "center" }}>
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
      </Container>
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
    </>
  );
}

export default ProductsPage;
