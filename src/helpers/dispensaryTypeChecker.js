function dispensaryTypeChecker(dispensaryType) {

    switch (dispensaryType) {
        case 'DISPENSARY':
            return 'dispensaries'
            break;

        case 'DELIVERY':
            return 'deliveries'
            break;

        case 'DOCTOR':
            return 'doctors'
            break;
    
        default:
            break;
    }

}

export default dispensaryTypeChecker