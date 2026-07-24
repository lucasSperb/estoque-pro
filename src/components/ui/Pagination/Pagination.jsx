import "./Pagination.css";

import {
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">
            <button
                className="pagination__button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <FiChevronLeft />
            </button>

            <div className="pagination__numbers">
                {pages.map((number) => (
                    <button
                        key={number}
                        className={
                            currentPage === number
                                ? "pagination__page active"
                                : "pagination__page"
                        }
                        onClick={() => onPageChange(number)}
                    >
                        {number}
                    </button>
                ))}
            </div>

            <button
                className="pagination__button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <FiChevronRight />
            </button>
        </div>
    );
}

export default Pagination;