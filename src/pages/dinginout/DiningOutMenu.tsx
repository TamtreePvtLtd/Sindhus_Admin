import { Box, Button, Checkbox, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useDeleteDiningoutMenu,
  useGetAllDiningOutMenuWithProducts,
} from "../../customRQHooks/Hooks";
import {
  createDiningOutProduct,
  getAllDiningOutId,
  updateDiningOutProduct,
} from "../../services/api";
import { useSnackBar } from "../../context/SnackBarContext";
import { SnackbarSeverityEnum } from "../../enums/SnackbarSeverityEnums";
import CommonSaveDialog from "../../common/components/CommonSaveDialog";
import CommonClearDialog from "../../common/components/CommonClearDialog";
import { useTheme } from "@mui/material/styles";

interface MenuProductCount {
  [key: string]: string[];
}

interface MenuItem {
  _id: string;
  title: string;
  products: { _id: string; title: string }[];
}

function DiningOutMenu() {
  const diningOutMenus = useGetAllDiningOutMenuWithProducts();
  const { updateSnackBarState } = useSnackBar();
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [menuWiseProductCounts, setMenuwiseProductCounts] =
    useState<MenuProductCount>({});
  const [selectedMenuProductIds, setSelectedMenuProductIds] = useState<
    string[]
  >([]);
  const [diningOutId, setDiningOutId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [isClearMenuProductsDialogOpen, setIsClearMenuProductsDialogOpen] =
    useState(false);

  const [originalSelectedProductIds, setOriginalSelectedProductIds] = useState<
    string[]
  >([]);
  const [originalMenuWiseProductCounts, setOriginalMenuWiseProductCounts] =
    useState<MenuProductCount>({});
  const theme = useTheme();

  useEffect(() => {
    getMenuDatas();
  }, []);

  useEffect(() => {
    if (selectedMenu !== null) {
      setOriginalSelectedProductIds(selectedProductIds);
      setOriginalMenuWiseProductCounts(menuWiseProductCounts);
    }
  }, [selectedMenu]);
  const deleteDiningOutMenuMutation = useDeleteDiningoutMenu();

  const resetChanges = () => {
    setSelectedProductIds(originalSelectedProductIds);
    setMenuwiseProductCounts(originalMenuWiseProductCounts);
    setSelectedMenuProductIds(
      originalMenuWiseProductCounts[selectedMenu as string] || []
    );
  };

  const getMenuDatas = async () => {
    try {
      const response = await getAllDiningOutId();
      if (response && response.length > 0) {
        const menuProductCounts: MenuProductCount = {};
        const allProductIds: string[] = [];

        for (const menuData of response) {
          if (menuData.menu && Array.isArray(menuData.menu)) {
            for (const menu of menuData.menu) {
              const menuId: string = menu.mainMenuId;
              const productIds: string[] = menu.productIds;

              setSelectedProductIds((prevSelectedProducts) => [
                ...prevSelectedProducts,
                ...productIds,
              ]);
              menuProductCounts[menuId] = productIds;
              allProductIds.push(...productIds);
            }
          }
        }
        setMenuwiseProductCounts(menuProductCounts);
        setSelectedMenuProductIds(allProductIds);

        setSelectedMenu(null);
        setDiningOutId(response[0]._id);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClearMenuProducts = async () => {
    setIsClearMenuProductsDialogOpen(false);
    if (selectedMenu) {
      deleteDiningOutMenuMutation.mutate(selectedMenu, {
        onSuccess: () => {
          setMenuwiseProductCounts((prev) => {
            const newCounts = { ...prev };
            newCounts[selectedMenu] = [];
            return newCounts;
          });
          setSelectedMenuProductIds([]);
          updateSnackBarState(
            true,
            "Selected Menus Products cleared successfully",
            SnackbarSeverityEnum.SUCCESS
          );
        },
        onError: (error) => {
          console.error("Error:", error);
          updateSnackBarState(
            true,
            "Error occurred while clearing products",
            SnackbarSeverityEnum.ERROR
          );
        },
      });
    }
  };

  const handleClearButtonClick = async () => {
    setSelectedProductIds([]);
    setMenuwiseProductCounts({});
    setSelectedMenuProductIds([]);
    setClearDialogOpen(false);

    await updateSelectedMenuProducts([]);
    updateSnackBarState(
      true,
      "All DiningOut Products Cleared successfully",
      SnackbarSeverityEnum.SUCCESS
    );
  };

  const updateSelectedMenuProducts = async (productIds) => {
    if (diningOutId) {
      try {
        const updatedMenus = Object.keys(menuWiseProductCounts).map(
          (menuId) => ({
            menuId,
            productIds: [],
          })
        );

        await updateDiningOutProduct(diningOutId, {
          menu: updatedMenus,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenu(menuId);

    setSelectedMenuProductIds(
      selectedProductIds.filter((productId) => {
        const menuData =
          diningOutMenus.data &&
          diningOutMenus.data.find((menu) => menu._id === menuId);
        if (menuData) {
          return menuData.products.some((product) => product._id === productId);
        }
      })
    );
  };

  const handleProductSelect = (productId: string) => {
    const isSelected = selectedProductIds.includes(productId);
    setSelectedProductIds((prevSelectedProducts) =>
      isSelected
        ? prevSelectedProducts.filter((item) => item !== productId)
        : [...prevSelectedProducts, productId]
    );

    setMenuwiseProductCounts((prevProduct) => {
      const updatedproducts = { ...prevProduct };

      for (const menuId in updatedproducts) {
        const menuData =
          diningOutMenus.data &&
          diningOutMenus.data.find((menu) => menu._id === menuId);
        if (
          menuData &&
          menuData.products.some((product) => product._id === productId)
        ) {
          updatedproducts[menuId] = isSelected
            ? (prevProduct[menuId] || []).filter((item) => item !== productId)
            : (prevProduct[menuId] || []).concat(productId);
        }
      }

      if (selectedMenu !== null) {
        updatedproducts[selectedMenu] = isSelected
          ? (prevProduct[selectedMenu] || []).filter(
              (item) => item !== productId
            )
          : (prevProduct[selectedMenu] || []).concat(productId);
      }

      return updatedproducts;
    });

    if (selectedMenu !== null) {
      setSelectedMenuProductIds((prevSelectedProducts) =>
        isSelected
          ? prevSelectedProducts.filter((item) => item !== productId)
          : [...prevSelectedProducts, productId]
      );
    }
  };

  const getSelectedMenuProductCount = (menuId: string) => {
    return menuWiseProductCounts[menuId]
      ? menuWiseProductCounts[menuId].length
      : 0;
  };

  const handleSaveButtonClick = async () => {
    try {
      const newSelectedMenusArray: {
        menuId: string;
        productIds: string[];
      }[] = [];

      for (const menuId in menuWiseProductCounts) {
        const productIds = menuWiseProductCounts[menuId];
        if (productIds.length > 0) {
          newSelectedMenusArray.push({ menuId, productIds });
        }
      }

      if (diningOutId) {
        updateDiningOutProduct(diningOutId, {
          menu: newSelectedMenusArray,
        }).then(() => {
          getMenuDatas().catch((error) => {
            console.error("Error fetching updated DiningOutIds:", error);
          });
          setIsDialogOpen(false);
          updateSnackBarState(
            true,
            "DiningOut Product updated successfully",
            SnackbarSeverityEnum.SUCCESS
          );
        });
      } else {
        const response = await createDiningOutProduct({
          menu: newSelectedMenusArray,
        }).then(() => {
          getMenuDatas().catch((error) => {
            console.error("Error fetching updated DiningOutIds:", error);
          });
          updateSnackBarState(
            true,
            "DiningOut Product created successfully",
            SnackbarSeverityEnum.SUCCESS
          );
        });
        const newDiningOutId = response[0]._id;
        setDiningOutId(newDiningOutId);
      }
    } catch (error) {
      console.error("Error:", error);
      updateSnackBarState(
        true,
        "Error occurred while saving",
        SnackbarSeverityEnum.ERROR
      );
    }
  };

  const handleSave = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetChanges();
  };

  useEffect(() => {
    if (selectedMenu !== null) {
      setSelectedMenuProductIds(
        menuWiseProductCounts[selectedMenu as string] || []
      );
    }
  }, [selectedMenu, menuWiseProductCounts]);

  const handleCancel = () => {
    resetChanges();
  };
  return (
    <>
      <Grid sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                overflowY: "auto",
                maxHeight: "500px",
                maxWidth: { xs: "100%", sm: "250px" },
              }}
            >
              {diningOutMenus &&
              diningOutMenus.data &&
              diningOutMenus.data.length > 0 ? (
                diningOutMenus.data.map((menuItem) => (
                  <Box key={menuItem._id} sx={{ padding: "1px" }}>
                    <Box
                      sx={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "start",
                        gap: 2,
                        cursor: "pointer",
                        backgroundColor:
                          selectedMenu === menuItem._id
                            ? theme.palette.primary.main
                            : "white",
                        color:
                          selectedMenu === menuItem._id
                            ? "white"
                            : theme.palette.text.primary,
                      }}
                      onClick={() => handleMenuSelect(menuItem._id)}
                    >
                      <Typography>{menuItem.title}</Typography>
                      <Typography>
                        ({getSelectedMenuProductCount(menuItem._id)})
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">No menu items available</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={9}>
            {selectedMenu !== null && (
              <Box
                sx={{
                  gap: 1,
                  maxHeight: "70vh",
                  overflowY: "auto",
                  marginRight: "15px",
                }}
              >
                <Grid item container>
                  {diningOutMenus &&
                    diningOutMenus.data &&
                    diningOutMenus.data
                      .find((item) => item._id === selectedMenu)
                      ?.products.map((product) => (
                        <Grid item xs={6} sm={3} key={product._id}>
                          <Box
                            sx={{
                              display: "flex",
                              borderRadius: "10px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              cursor: "pointer",
                              margin: "8px",
                            }}
                            onClick={() => handleProductSelect(product._id)}
                          >
                            <Typography
                              sx={{
                                marginLeft: "8px",
                                overflowY: "hidden",
                                lineHeight: 1.2,
                                wordWrap: "break-word",
                                fontSize: { xs: "0.8rem", sm: "1rem" },
                              }}
                            >
                              {product.title}
                            </Typography>
                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Checkbox
                                checked={selectedMenuProductIds.includes(
                                  product._id
                                )}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-end" },
            pb: 3,
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setIsClearMenuProductsDialogOpen(true)}
            sx={{ width: { xs: "60%", sm: "auto" } }}
          >
            Clear Menu Products
          </Button>
          <Button
            variant="contained"
            onClick={() => setClearDialogOpen(true)}
            sx={{ width: { xs: "60%", sm: "auto" } }}
          >
            Clear Products
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "row" },
              justifyContent: { xs: "center", sm: "flex-end" },
              width: { xs: "100%", sm: "auto" },
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                maxWidth: "64px",
                width: { xs: "50%", sm: "auto" },
                color: theme.palette.primary.main,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ width: { xs: "50%", sm: "auto" }, maxWidth: "80px" }}
            >
              Save
            </Button>
          </Box>
        </Box>

        <CommonSaveDialog
          dialogOpen={isDialogOpen}
          onDialogclose={handleDialogClose}
          onSave={handleSaveButtonClick}
          title="Save Dining Out Menu"
          content="Do you want to save the changes?"
        />
        {clearDialogOpen && (
          <CommonClearDialog
            title="Clear All Products"
            content="Are you sure want to clear all the Products?.This will Clear all the Selection"
            dialogOpen={clearDialogOpen}
            onDialogclose={() => setClearDialogOpen(false)}
            onDelete={handleClearButtonClick}
          />
        )}

        <CommonClearDialog
          title="Clear Menus Products"
          content="Are you sure want to clear the Selected Menus Products?"
          dialogOpen={isClearMenuProductsDialogOpen}
          onDialogclose={() => setIsClearMenuProductsDialogOpen(false)}
          onDelete={handleClearMenuProducts}
        />
      </Grid>
    </>
  );
}

export default DiningOutMenu;