import React from "react";
import { Grid, Column, Breadcrumb, BreadcrumbItem } from '@carbon/react';
import './TopContent.scss';

export default function TopContent () {
  return(
    <Grid className="head-content" fullWidth>

    <Column lg={16} md={8} sm={4} className="head-content__banner">
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <a href="/">Discover Systems</a>
        </BreadcrumbItem>
      </Breadcrumb>
      <h1 className="head-content__heading">Crypto Asset Discovery</h1>
      <p className="head-content__desc">Crypto Assets Discovery can help organizations have a consolidated view of their crypto assets. They can take corrective actions as  per  regulations  or  can  protect  the  location  of  these  crypto  assets  if  it  not secure.(Such as moving the crypto assets to a key management server)</p>
    </Column>

    </Grid>  
  );
}
