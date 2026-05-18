import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Hexagon, QrCode, ShieldCheck, Settings } from 'lucide-react';
import Layout from '../components/Layout';
import { useTarjetas } from '../api/hooks';
import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';

export default function TarjetaPage() {
  const { numero } = useParams();
  const { data: tarjetas, isLoading } = useTarjetas();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1.0 });
      const link = document.createElement('a');
      link.download = `tarjeta-${numero}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const tarjeta = tarjetas?.find((t: any) => t.numero.toString() === numero);

  const getMotivoLabel = (motivo: string) => {
    switch (motivo) {
      case 'impago': return 'Impago de Impuesto';
      case 'vencimiento': return 'Tarjeta Vencida';
      case 'robo': return 'Reporte de Robo';
      case 'inactivacion_definitiva': return 'Inactivación Definitiva';
      default: return motivo || 'No especificado';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      </Layout>
    );
  }

  if (!tarjeta) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <Hexagon className="mx-auto text-gray-500 mb-4 opacity-50" size={64} />
          <h2 className="text-2xl font-bold text-white mb-2">Tarjeta no encontrada</h2>
          <p className="text-gray-400 mb-6">El documento de circulación vehicular número {numero} no existe en la base de datos.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-brand-900 font-bold rounded-lg transition-colors">
            <ArrowLeft size={18} /> Volver al Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Detalle de Tarjeta</h1>
            <p className="text-gray-400">Documento electrónico de circulación vehicular</p>
          </div>
          <div className="flex gap-3">
            <Link to={`/tarjeta/${numero}/gestionar`} className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors border border-purple-500/30">
              <Settings size={18} /> Gestionar
            </Link>
            <button 
              onClick={handleDownload} 
              disabled={!tarjeta.estado}
              className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${
                tarjeta.estado 
                  ? 'bg-brand-500 hover:bg-brand-600 text-brand-900 shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                  : 'bg-surface-300 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Download size={18} /> Descargar
            </button>
          </div>
        </div>

        {/* The Card Representation */}
        <div className="relative w-full max-w-3xl mx-auto mt-12 mb-12">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-brand-500/20 blur-[50px] rounded-[2rem] -z-10"></div>

          <div ref={cardRef} className="w-full aspect-[1.586/1] bg-gradient-to-br from-[#0c1220] to-[#06080d] rounded-[2rem] border border-surface-300 p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Watermark */}
            <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
              <Hexagon size={400} strokeWidth={1} className="text-brand-500" />
            </div>

            {/* Absolute Status Indicator in Top-Left Corner */}
            <div className="absolute top-4 left-10 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-200/60 border border-surface-300/80 shadow-md">
              <div className={`w-2 h-2 rounded-full ${tarjeta.estado ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
              <span className={`text-[9px] uppercase tracking-wider font-bold ${tarjeta.estado ? 'text-green-400' : 'text-red-400'}`}>
                {tarjeta.estado ? 'Activa' : `Inactiva: ${getMotivoLabel(tarjeta.motivo_inactivacion)}`}
              </span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start border-b border-surface-300/50 pb-4 z-10 mt-2">
              <div className="flex items-center gap-3">
                <Hexagon className="text-brand-500" fill="currentColor" fillOpacity={0.2} size={32} />
                <div>
                  <h2 className="text-xl font-bold text-white tracking-widest uppercase">NexDrive</h2>
                  <p className="text-[10px] text-brand-500 uppercase tracking-widest">Tarjeta de Circulación Electrónica</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">No. de Documento</p>
                <p className="text-lg font-mono font-bold text-white tracking-wider">{tarjeta.numero}</p>
              </div>
            </div>

            {/* Content Grid Area */}
            <div className="grid grid-cols-4 gap-x-4 gap-y-3 z-10 py-2">
              {/* Row 1 */}
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">NIT Propietario</p>
                <p className="text-sm font-bold text-gray-200">{tarjeta.propietario?.nit || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Nombre del Propietario</p>
                <p className="text-sm font-bold text-gray-200 uppercase truncate">{tarjeta.propietario?.nombre || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">CUI (DPI)</p>
                <p className="text-sm font-bold text-gray-200">{tarjeta.propietario?.cui_p || 'N/A'}</p>
              </div>

              {/* Row 2 */}
              <div className="col-span-1">
                <p className="text-[9px] text-brand-600 uppercase tracking-wider mb-0.5 font-bold">Uso</p>
                <p className="text-sm font-bold text-white bg-brand-500/10 px-2 py-0.5 rounded inline-block">{tarjeta.estado_vehiculo?.uso_vehiculo?.uso || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-brand-600 uppercase tracking-wider mb-0.5 font-bold">Placa</p>
                <p className="text-base font-bold text-white tracking-widest">{tarjeta.estado_vehiculo?.placa || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Tipo</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.tipo_vehiculo?.tipo || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Modelo</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.modelo || 'N/A'}</p>
              </div>

              {/* Row 3 */}
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Marca</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.linea_vehiculo?.marca_vehiculo?.marca || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Línea</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.linea_vehiculo?.linea || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Serie</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.serie || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Color</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.color?.color || 'N/A'}</p>
              </div>

              {/* Row 4 */}
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">VIN</p>
                <p className="text-xs font-mono text-gray-400 break-all">{tarjeta.estado_vehiculo?.vehiculo?.vin || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Chasis</p>
                <p className="text-xs font-mono text-gray-400 break-all">{tarjeta.estado_vehiculo?.vehiculo?.chasis || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Motor</p>
                <p className="text-xs font-mono text-gray-400 break-all">{tarjeta.estado_vehiculo?.motor || 'N/A'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Cilindros</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.cilindros || '-'}</p>
              </div>

              {/* Row 5 */}
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Centímetros Cúbicos</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.cc || '-'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Asientos</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.asientos || '-'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Ejes</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.ejes || '-'}</p>
              </div>
              <div className="col-span-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Toneladas</p>
                <p className="text-sm font-medium text-gray-300">{tarjeta.estado_vehiculo?.vehiculo?.ton || '0'}</p>
              </div>
            </div>

            {/* Footer with QR */}
            <div className="pt-4 border-t border-surface-300/50 flex justify-between items-end z-10 gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-brand-500 mb-2">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Validación Electrónica Segura</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[8px] uppercase tracking-wider text-gray-400">
                  <div>
                    <span className="block text-gray-500 mb-0.5">Fecha Registro</span>
                    <span className="font-mono text-gray-300">{tarjeta.fecha_registro ? new Date(tarjeta.fecha_registro).toLocaleDateString(undefined, { timeZone: 'UTC' }) : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-0.5">Emisión</span>
                    <span className="font-mono text-gray-300">{tarjeta.fecha_emision ? new Date(tarjeta.fecha_emision).toLocaleDateString(undefined, { timeZone: 'UTC' }) : 'N/A'} {tarjeta.hora_emision ? new Date(tarjeta.hora_emision).toLocaleTimeString(undefined, { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-0.5">Vencimiento</span>
                    <span className="font-mono text-gray-300">{tarjeta.fecha_vencimiento ? new Date(tarjeta.fecha_vencimiento).toLocaleDateString(undefined, { timeZone: 'UTC' }) : 'N/A'}</span>
                  </div>
                  <div className="col-span-3 mt-1">
                    <span className="text-gray-500 mr-2">Código Unico Identificador:</span>
                    <span className="font-mono text-brand-400">{tarjeta.cui_tc || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="w-20 h-20 bg-white p-1.5 rounded-xl shrink-0">
                <QrCode className="w-full h-full text-black" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
