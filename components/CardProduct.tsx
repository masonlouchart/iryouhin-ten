import { Card, Image, Skeleton } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import React, { ReactElement } from "react";
import { Currency } from "../store/slices/currenciesSlices";
import { Product } from "../store/slices/productsSlices";

const { Meta } = Card;

export type CardProductProps = Partial<Product> & {
  loading?: boolean;
  currency?: Currency;
};

/**
 * A card which displays the picture, price and description of a product inside
 * a rounded-corners rectangle in shape of a playing card.
 */
const CardProduct = ({
  title,
  price,
  image,
  loading = false,
  currency,
}: CardProductProps): ReactElement => {
  return (
    <Card
      hoverable
      style={{
        height: "100%",
        maxHeight: "350px",
        width: "250px",
        borderRadius: "20px",
        overflow: "hidden",
      }}
      bodyStyle={{ position: "relative", bottom: 0 }}
      cover={<CardCover loading={loading} title={title} image={image} />}
    >
      <Skeleton loading={loading} paragraph={{ rows: 2 }} active>
        <Meta
          title={Product.formatPrice(price, currency)}
          description={
            <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
              {title}
            </Paragraph>
          }
        />
      </Skeleton>
    </Card>
  );
};

export default CardProduct;

type CardCoverProps = {
  loading?: boolean;
  title?: string;
  image?: string;
};

/**
 * Cover of the product card. It displays an image or a placeholder if the `loading`
 * attribute id true.
 */
const CardCover = ({ loading, title, image }: CardCoverProps): ReactElement => {
  const imgStyle = {
    margin: "auto",
    width: "auto",
    maxWidth: "180px",
    height: "180px",
    maxHeight: "calc(180px - 24px)",
  };
  return (
    <div
      style={{
        height: "200px",
        padding: "24px 24px 16px 24px",
        alignItems: "center",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {loading ? (
        <Skeleton.Image style={imgStyle} />
      ) : (
        <Image style={imgStyle} alt={title} src={image} preview={false} />
      )}
    </div>
  );
};
