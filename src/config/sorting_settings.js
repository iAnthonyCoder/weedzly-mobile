const sorting_settings = {
    ordersPage:{
        label: 'Sort by',
        icon: 'bx bx-sort',
        opts: [
            {
                label:"Date", 
                sortField:"createdAt", 
                sortOrder:"desc", 
                selected:true,
                id:1
            }
        ]
    },
    productsPage:{
        label: 'Sort by',
        icon: 'bx bx-sort',
        opts: [
            {
                label:"Name A-Z", 
                sortField:"name", 
                sortOrder:"asc", 
                selected:true,
                id:1
            },
            {
                label:"Name Z-A", 
                sortField:"name", 
                sortOrder:"desc",
                id:2
            },
            {
                label:"Rating", 
                sortField:"avgRating", 
                sortOrder:"desc",
                id:3
            },
        ]
    },
    businessesPage: {
        label: 'Sort by',
        icon: 'bx bx-sort',
        opts: [
            {
                id:1,
                label:"Relevance", 
                sortField:"score", 
                sortOrder:"desc", 
                
            },
            {
                id:2,
                label:"Distance", 
                sortField:"calcDistance", 
                sortOrder:"asc",
                selected:true
            },
            {
                id:3,
                label:"Name A-Z", 
                sortField:"name", 
                sortOrder:"asc"
            },
            {
                id:4,
                label:"Name Z-A", 
                sortField:"name", 
                sortOrder:"desc"
            },
        ]
    },
    strainsPage: {
        label: 'Sort by',
        icon: 'bx bx-sort',
        opts: [
            {
                id:1,
                label:"Rating", 
                sortField:"avgRating", 
                sortOrder:"desc", 
            },{
                id:2,
                label:"Name Z-A", 
                sortField:"name", 
                sortOrder:"desc", 
            },{
                id:3,
                label:'Name A-Z',
                sortField:'name',
                sortOrder:'asc',
                selected:true
            }
        ]
    },
    brandsPage: {
        label: 'Sort by',
        icon: 'bx bx-sort',
        opts: [
            {
                id:1,
                label:"Name A-Z", 
                sortField:"name", 
                sortOrder:"asc", 
                selected:true
            },{
                id:2,
                label:'Name Z-A',
                sortField:'name',
                sortOrder:'desc',
            }
        ]
    },
    dealsPage:{
        label: 'Sort by',
        icon: 'bx bx-sort',
        opts: [
            {
                id:1,
                label:"Nearest", 
                sortField:"calcDistance", 
                sortOrder:"asc", 
                selected:true
            },
            {
                id:2,
                label:"Furthest", 
                sortField:"calcDistance", 
                sortOrder:"desc", 
            }
        ]
    },
    profileReviewsPage:{
        label: 'Sort by',
        icon: 'bx bx-sort',
        opts: [
            {
                id:1,
                label:"Recent", 
                sortField:"createdAt", 
                sortOrder:"desc", 
                selected:true
            }
        ]
    },
    articlesPage:{
        label: 'Sort by',
        icon: 'bx bx-sort',
        opts: [
            {
                id:1,
                label:"A-Z", 
                sortField:"name", 
                sortOrder:"desc", 
            },{
                id:1,
                label:"Z-A", 
                sortField:"name", 
                sortOrder:"asc", 
            },{
                id:3,
                label:"Newer", 
                sortField:"createdAt", 
                sortOrder:"desc", 
                selected:true
            },{
                id:4,
                label:"Older", 
                sortField:"createdAt", 
                sortOrder:"asc", 
            }
        ]
    }
}

export default sorting_settings