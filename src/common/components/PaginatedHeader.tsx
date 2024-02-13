import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Pagination,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IPageInfo } from "../../interface/types";
import { useTheme } from "@mui/material/styles";

interface IProps {
  onRowsPerPageChange(rowsCount: number): void;
  onPageChange(currentPage: number): void;
  pagetitle: string;
  onAddClick?(): void;
  addButtonText?: string;
  pageInfo: IPageInfo | undefined;
}

function PaginatedHeader(props: IProps) {
  const theme = useTheme();

  return (
    <>
      <Grid container alignItems={"center"} my={2}>
        <Grid item xs={12} md={4}>
          <Box display={"flex"} gap={3}>
            <Typography
              sx={{ mb: 0 }}
              variant="h4"
              gutterBottom
              component="div"
            >
              {props.pagetitle}&nbsp;
              <Box
                sx={{ opacity: 0.7, color: `${theme.palette.primary.main}` }}
                component={"span"}
              >
                ({props.pageInfo?.totalItems})
              </Box>
            </Typography>
            {!!props.addButtonText && (
              <Button variant="contained" onClick={props.onAddClick}>
                <AddIcon />
                {props.addButtonText}
              </Button>
            )}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="take-count-label">Take Count</InputLabel>
              <Select
                labelId="take-count"
                id="take-count"
                value={props.pageInfo?.pageSize ?? 10}
                label="Take Count"
                onChange={(_e) => {
                  props.onRowsPerPageChange(Number(_e.target.value));
                  props.onPageChange(1);
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </FormControl>
            <Pagination
              count={props.pageInfo?.totalPages}
              variant="outlined"
              color="primary"
              onChange={(_e, page) => props.onPageChange(page)}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default PaginatedHeader;
