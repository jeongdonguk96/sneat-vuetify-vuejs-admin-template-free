export const formatCtn = (ctn) => {
    return `${ctn.slice(0, 3)}-${ctn.slice(3, 7)}-${ctn.slice(7)}`;
};


export const maskingCtn = (ctn) => {
    if (ctn == null) {
        return;
    }
    
    return ctn.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-****-$3");
};


export const maskingId = (id) => {
    if (id == null) {
        return;
    }
    
    const visiblePart = id.slice(0, 3);
    const maskedPart = '*'.repeat(Math.max(0, id.length - 3));
    
    return `${visiblePart}${maskedPart}`;
};


export const maskingEmail = (email) => {
    if (email == null) {
        return;
    }
    
    const [localPart, domain] = email.split('@');
    const visiblePart = localPart.slice(0, 3);
    const maskedPart = '*'.repeat(Math.max(0, localPart.length - 3));
    
    return `${visiblePart}${maskedPart}@${domain}`;
};


export const maskingName = (name) => {
    if (name == null) {
        return;
    }
    
    const length = name.length;
	const firstName = name.substring(0,1);
	const lastName = name.substring(name.length-1, name.length);
    
    let maskName = '';
    for (var i = 0 ; i < length - 2 ; i++) {
		maskName += '*'
	}
    
    return `${firstName}${maskName}${lastName}`;
};
