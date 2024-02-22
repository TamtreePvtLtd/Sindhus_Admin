// import { Box, Button, Container, Typography } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";

// function Specials() {

//   return (
//     <>
//       <Container>
//         <Box
//           sx={{
//             width: "100%",
//             textAlign: "center",
//             mt: 5,
//           }}
//         >
//           <Typography variant="h4" gutterBottom component="div">
//             Special Offers
//           </Typography>
//                   <Box sx={{mt:5}}>
//             <Button
//               component="label"
//               variant="outlined"
//               startIcon={<AddIcon />}
//             >
//               Upload Images
//               <input
//                 type="file"
//                 style={{ display: "none" }}
//                 // onChange={handlePosterImageUpload}
//               />
//             </Button>
//           </Box>
//         </Box>
//       </Container>
//     </>
//   );
// }

// export default Specials;


import { Box, Button, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCreateSpecials } from "../../customRQHooks/Hooks";


function Specials() {
  const { mutate } = useCreateSpecials(); // Destructure the mutate function from useCreateSpecials

 const handleImageChange = async (
   event: React.ChangeEvent<HTMLInputElement>
 ) => {
   try {
     const files: FileList | null = event.target.files;

     if (files) {
       const imageFiles: File[] = Array.from(files);

       // Call the mutate function to create specials with the selected images
       await mutate(imageFiles);
     }
   } catch (error) {
     console.error("Error uploading images:", error);
     // Handle error
   }
 };



  return (
    <>
      <Container>
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mt: 5,
          }}
        >
          <Typography variant="h4" gutterBottom component="div">
            Special Offers
          </Typography>
          <Box sx={{ mt: 5 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<AddIcon />}
            >
              Upload Images
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange} // Call handleImageChange when files are selected
                multiple // Allow multiple file selection
              />
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Specials;
