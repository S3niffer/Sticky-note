const FaNumTranslatorToEn = (str: string) => {
    return str.replace(/[۰-۹]/g, (match) => {
        switch (match) {
            case "۰":
                return "0";
            case "۱":
                return "1";
            case "۲":
                return "2";
            case "۳":
                return "3";
            case "۴":
                return "4";
            case "۵":
                return "5";
            case "۶":
                return "6";
            case "۷":
                return "7";
            case "۸":
                return "8";
            case "۹":
                return "9";
            default:
                return "";
        }
    });
};

export default FaNumTranslatorToEn;
