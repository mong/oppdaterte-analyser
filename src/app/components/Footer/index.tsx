import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export default function Footer() {
    return (
        <Grid container>
            <Grid xs={12} sm={6} marginBottom={2} marginTop={2} sx={{ bgcolor: "footer1.main", color: "footer1.contrastText" }}>
                <Typography variant="body1">Footer text</Typography>
            </Grid>
        </Grid>
    );
}