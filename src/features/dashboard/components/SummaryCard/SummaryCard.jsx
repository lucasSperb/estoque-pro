import "./SummaryCard.css";

import { useNavigate } from "react-router-dom";

import {
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";

import { summaryCards } from "../../mocks/dashboardData";

function SummaryCard() {
  const navigate = useNavigate();

  return (
    <>
      {summaryCards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.id}
            className="summaryCard"
            onClick={() => navigate(card.route)}
          >
            <div className="summaryCard__top">

              <div
                className="summaryCard__icon"
                style={{
                  background: `${card.color}20`,
                  color: card.color,
                }}
              >
                <Icon />
              </div>

              <div
                className={`summaryCard__variation ${
                  card.positive
                    ? "positive"
                    : "negative"
                }`}
              >
                {card.positive ? (
                  <FiArrowUpRight />
                ) : (
                  <FiArrowDownRight />
                )}

                {card.variation}

              </div>

            </div>

            <div className="summaryCard__content">

              <span>{card.title}</span>

              <h2>{card.value}</h2>

            </div>

          </article>
        );
      })}
    </>
  );
}

export default SummaryCard;