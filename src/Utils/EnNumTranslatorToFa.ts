const EnNumTranslatorToFa = (number: number) => {
    return new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(
        number,
    );
};
export default EnNumTranslatorToFa;
