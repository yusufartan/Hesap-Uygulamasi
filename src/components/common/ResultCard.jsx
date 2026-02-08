import Card from '@mui/material/Card';

/**
 * Sonuçların gösterileceği şık, yuvarlatılmış kenarlı ve gölgeli Card bileşeni.
 */
function ResultCard({ children, ...props }) {
  return (
    <Card
      {...props}
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 2.5,
        overflow: 'hidden',
        '&:hover': {
          boxShadow: 6,
        },
        ...props.sx,
      }}
    >
      {children}
    </Card>
  );
}

export default ResultCard;
