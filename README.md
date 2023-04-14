# Final Project for GGR472 - Toronto Food Support and Education Map

## Aim

The aim of this project is to provide a useful web map based resource for people seeking accessible food options and services in Toronto. By educating the public about food insecurity and affordability in the City of Toronto, we hope it will aid and empower anyone trying to meet their food needs.

## Accessing the Project

Access the live web map by [clicking here](khttps://ananmaysharan.github.io/ggr472-group-project/).

## Interactive Functionality

- Popups on hover for each of the differing types of Food Establishments, with information about the resource.  
- Sidebar Accordion
-- Geocoder, which is configured to prioritize results from the Toronto area.
-- Checkbox based filters that allows the user to turn various layers on and off.
-- CANFED dropdown to show various graduated display layers using Mapbox GL JS interpolated fill-color.
-- Sociodemographic Checkbox that uses use the Turf.js LineString to create 3D peaks of visible minority counts. Special thanks to [William B. Davis's demonstration](https://willymaps.github.io/turfpeaks/).


## Data Sources

[DineSafe Food Licensing Data (City of Toronto Open Data Portal)](https://open.toronto.ca/dataset/dinesafe/): 

DineSafe is a food safety inspection system based on governmental regulations, that was used to source community kithcens and student nutrition sites. All drinking and dining establishments in the city need to comply with these regulations and continually post the most recent inspection notice near the main entrance. Any establishment in the city who wants to serve food needs to pass these inspections.

[Agincourt Community Services Association Toronto Food Asset Resources Map (ASCA)](https://www.agincourtcommunityservices.com/resources-acsas-food-asset-map):

ACSA is a community organization based in Scarbourough. ACSA's Food Asset Map was used to source multiple datasets including food banks, free/low-cost meals, food delivery services, Chinese & Middle Eastern supermarkets, community gardens, greenhouses, farmer's markets, and chain supermarkets.

[Community Fridges Toronto](https://communityfridgesto.org/): Community Fridges TO. is a Toronto-based mutual aid initiative created to nourish communities and neighbours: anyone can donate food as well as take what they need, ensuring accessible food 24/7.

[Canadian Food Environment Dataset - CAN-FED (Statistics Canada)](https://www150.statcan.gc.ca/n1/pub/13-20-0001/132000012022001-eng.htm): CAN-FED is a pan-Canadian dataset of retail food environment measures at the dissemination area (DA) level based on food outlet data from the 2018 Statistics Canada Business Register.





 
