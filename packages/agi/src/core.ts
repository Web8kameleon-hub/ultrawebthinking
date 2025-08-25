export interface Logger { info(msg:string):void; warn(msg:string):void; error(msg:string):void; }
export type AGILayerStatus = "active"|"inactive"|"processing"|"error"|"optimizing"|"learning";
export class AGICore {
  getMetrics(){ return { initialized:true, uptime: 0, totalLayers: 7, timestamp: Date.now() }; }
}
export const agiCore = new AGICore();
