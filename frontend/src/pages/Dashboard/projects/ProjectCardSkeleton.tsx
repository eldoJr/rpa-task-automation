import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Skeleton,
  Box,
} from "@mui/material";

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton variant="text" width="80%" height={24} />}
        subheader={<Skeleton variant="text" width="40%" height={20} />}
        action={<Skeleton variant="circular" width={24} height={24} />}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" width="80%" height={20} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Skeleton variant="rounded" width="30%" height={24} />
          <Box sx={{ textAlign: "right" }}>
            <Skeleton variant="text" width={60} height={16} />
            <Skeleton variant="text" width={80} height={16} />
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Skeleton variant="rounded" width={70} height={30} />
        <Skeleton variant="rounded" width={70} height={30} />
      </CardActions>
    </Card>
  );
};
