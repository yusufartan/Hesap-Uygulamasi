import Button from '@mui/material/Button';

/**
 * Gölgeli ve modern tasarımlı MUI contained buton.
 */
function PrimaryButton(props) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: 2.5,
        py: 1.25,
        '&:hover': {
          boxShadow: 4,
        },
        '&:active': {
          boxShadow: 1,
        },
        ...props.sx,
      }}
    />
  );
}

export default PrimaryButton;
