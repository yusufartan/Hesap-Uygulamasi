import TextField from '@mui/material/TextField';

/**
 * Kompakt, modern ve minimal MUI TextField bileşeni.
 * size="small" ve sx ile özelleştirilmiş kenarlar.
 */
function CompactInput(props) {
  return (
    <TextField
      size="small"
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: 'background.paper',
          '& fieldset': {
            borderWidth: 1,
            borderColor: 'divider',
          },
          '&:hover fieldset': {
            borderColor: 'primary.main',
            borderWidth: 1.5,
          },
          '&.Mui-focused fieldset': {
            borderWidth: 2,
            borderColor: 'primary.main',
          },
        },
        '& .MuiInputBase-input': {
          py: 1.25,
          px: 1.5,
        },
        ...props.sx,
      }}
    />
  );
}

export default CompactInput;
