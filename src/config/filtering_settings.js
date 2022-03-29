import { getDayAndTime } from "../helpers/time"
import { deal_target, effects, flavors, genetics, product_type_deals, strainType, product_type, ratingValues, priceRanges } from "./static_filters"

const filtering_settings = {
    productsPage:{
        static:[
            {
                label: 'Genetics',
                icon: 'bx-vial',
                items: genetics,
                field:'genetics',
                type: 'eq',
                multi: true,
            },
            {
                label: 'Categories',
                icon: 'bx-vial',
                items: product_type,
                field:'category',
                type: 'eq',
                multi: true,
            },
            {
                label: 'Rating',
                icon: 'bx-vial',
                items: ratingValues,
                field:'avgRating',
                type: 'gte',
                multi: false,
            },
            {
                label: 'Price',
                icon: 'bx-vial',
                items: priceRanges,
                field:'price',
                multi: false,
            },
            {
                label: 'THC Strength',
                icon: 'bx-vial',
                field:'thc.value',
                multi: false,
                type: 'range',
            },
            {
                label: 'CBD Strength',
                icon: 'bx-vial',
                field:'cbd.value',
                multi: false,
                type: 'range',
            }
        ]
    },
    businessesPage:{
        multi: false,
        options: [
            {
                label: `Open now`,
                value: getDayAndTime()
            },
            {
                label: `Recreational`,
                value: `&filterfield[]=isRecreational&filtertype[]=eq&filtervalue=true`
            },
            {
                label: `Medical`,
                value: `&filterfield[]=isMedical&filtertype[]=eq&filtervalue=true`
            },
            {
                label: `Online Ordering`,
                value: `&filterfield[]=isOnlineOrderingEnabled&filtertype[]=eq&filtervalue=true`
            },
            {
                label: `Curbside Pickup`,
                value: `&filterfield[]=isCurbsidePickupServiceAvailable&filtertype[]=eq&filtervalue=true`
            },
            {
                label: `ATM`,
                value: `&filterfield[]=amenities.isAtmAvailable&filtertype[]=eq&filtervalue=true`
            }
        ]
    },
    strainsTypes:{
        multi: false,
        options: [
            {
                label: `Hybrid`,
                value: `&filterfield[]=type&filtertype[]=eq&filtervalue[]=Hybrid`
            },
            {
                label: `Indica`,
                value: `&filterfield[]=type&filtertype[]=eq&filtervalue[]=Indica`
            },
            {
                label: `Sativa`,
                value: `&filterfield[]=type&filtertype[]=eq&filtervalue[]=Sativa`
            }
        ]
    },
    strainsPage:{
        static:[
            {
                label: 'type',
                icon: 'bx-vial',
                items: strainType,
                field:'type',
                type: 'eq',
                multi: true,
            },
            {
                label: 'Effects',
                icon: 'bxs-happy-heart-eyes',
                items: effects,
                field: 'effects.name',
                type: 'in',
                multi: true,
            },
            {
                label: 'Flavors',
                icon: 'bxs-food-menu',
                items: flavors,
                field: 'flavors.name',
                type: 'in',
                multi: true,
            }
        ],
    },
    dealsPage:{
        static:[
            {
                label: 'Valid For',
                icon: 'bx bx-group',
                items: deal_target,
                field:'target_audience',
                type: 'eq',
                multi: true,
            },
            {
                label: 'Categories',
                icon: 'bx bx-category-alt',
                // className:'hide-desktop',
                items: product_type_deals,
                field:'productTypes',
                type: 'eq',
                multi: true,
            },
        ]
    },
    mainMap:{
        static:[
            {
                label: 'Medical',
                icon: 'bx bx-group',
                value: 'true',
                field:'isMedical',
                type: 'eq',
                // multi: true,
            },{
                label: 'Recreational',
                icon: 'bx bx-group',
                value: 'true',
                field:'isRecreational',
                type: 'eq',
                // multi: true,
            },{
                label: 'Pickup',
                icon: 'bx bx-group',
                value: 'true',
                field:'isPickupServiceAvailable',
                type: 'eq',
                // multi: true,
            },{
                label: 'Delivery',
                icon: 'bx bx-group',
                value: 'true',
                field:'isDeliveryServiceAvailable',
                type: 'eq',
                // multi: true,
            },{
                label: 'Doctor',
                icon: 'bx bx-group',
                value: 'DOCTOR',
                field:'type',
                type: 'eq',
                // multi: true,
            },{
                label: 'Online Ordering',
                icon: 'bx bx-group',
                value: 'true',
                field:'isOnlineOrderingEnabled',
                type: 'eq',
                // multi: true,
            },{
                label: 'Curbside Pickup',
                icon: 'bx bx-group',
                value: 'true',
                field:'isCurbsidePickupServiceAvailable',
                type: 'eq',
                // multi: true,
            },{
                label: 'ATM',
                icon: 'bx bx-group',
                value: 'true',
                field:'amenities.isAtmAvailable',
                type: 'eq',
                // multi: true,
            },{
                label: 'Accessible',
                icon: 'bx bx-group',
                value: 'true',
                field:'amenities.isAccessible',
                type: 'eq',
                // multi: true,
            },{
                label: 'Security',
                icon: 'bx bx-group',
                value: 'true',
                field:'amenities.isSecurityAvailable',
                type: 'eq',
                // multi: true,
            },
        ]
    },
}

export default filtering_settings

