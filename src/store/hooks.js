import { useDispatch, useSelector } from 'react-redux'

// Proje genelinde bu hook'ları kullanmak, ileride tip güvenliği 
// veya middleware entegrasyonu sağlarken kolaylık sunar.
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
