/**
 * Material-UI Select bileşenleri için ortak MenuProps ayarları
 * Menu content'in sidebar ve footer gibi elementlerin üzerine gelmesi için yüksek z-index
 */
export const SELECT_MENU_PROPS = {
  disablePortal: false, // Portal kullanarak body'ye render et (varsayılan)
  PaperProps: { 
    sx: { 
      zIndex: 1400, // Sidebar (1300) ve diğer elementlerin üzerine gelsin
    } 
  },
}
