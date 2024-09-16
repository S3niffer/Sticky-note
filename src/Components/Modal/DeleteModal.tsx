import { Props as ModalProps } from "./ModalWrapper";

type Props = ModalProps & { Delete: () => void };

const DeleteModal = ({ Close, Delete: DeleteNote }: Props) => {
    return (
        <div className="w-full max-w-md xl:max-w-xl bg-slate-700 border border-slate-950 flex flex-col gap-3 xl:gap-6">
            <p
                onClick={Close}
                className="border-b p-4 py-3 text-3xl cursor-pointer"
            >
                X
            </p>
            <div className="px-2">آیا از حذف کردن نوت اطمینان دارید؟</div>
            <div className="grid items-center grid-cols-2 text-slate-700">
                <button
                    onClick={DeleteNote}
                    className="p-2 bg-red-500 hover:bg-red-600 border-l border-l-slate-600 text-gray-300"
                >
                    حذف
                </button>
                <button
                    className="p-2 bg-slate-400 hover:bg-slate-500 border-r border-r-slate-600"
                    onClick={Close}
                >
                    بیخیال
                </button>
            </div>
        </div>
    );
};
export default DeleteModal;
