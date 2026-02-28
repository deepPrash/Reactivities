import { Grid, Typography } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";

export default function ProfilePage() {
  const { id } = useParams();
  const { profile, loadingProfile } = useProfile(id);

  if (loadingProfile)
    return (
      <Typography variant="h5" align="center" sx={{ mt: 5 }}>
        Loading profile...
      </Typography>
    );

  if (!profile)
    return (
      <Typography variant="h5" align="center" sx={{ mt: 5 }}>
        Profile not found
      </Typography>
    );

  return (
    <Grid container>
      <Grid size={12}>
        <ProfileHeader />
        <ProfileContent />
      </Grid>
    </Grid>
  );
}
