import { Module } from '@nestjs/common';
import { CellManagerService } from './cell-manager.service';
import { K8sService } from './k8s/k8s.service';

@Module({
  providers: [CellManagerService, K8sService],
  exports: [CellManagerService],
})
export class CellManagerModule {}
