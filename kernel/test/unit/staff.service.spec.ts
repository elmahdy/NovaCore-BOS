import { StaffService } from '../../src/modules/staff/staff.service';
import { UsersService } from '../../src/modules/users/users.service';

describe('StaffService', () => {
  let staffService: StaffService;
  let usersService: UsersService;
  let userId: string;

  beforeEach(() => {
    usersService = new UsersService();
    staffService = new StaffService(usersService);
    // Créer un compte User de référence
    const user = usersService.create({
      email: 'agent@novacore.io',
      password: 'password123',
      roles: ['user'],
    });
    userId = user.id;
  });

  it('should create a staff account linked to a user', () => {
    const staff = staffService.create({
      userId,
      matricule: 'AG-001',
      firstName: 'Jean',
      lastName: 'Dupont',
    });
    expect(staff.id).toBeDefined();
    expect(staff.userId).toBe(userId);
    expect(staff.staffRole).toBe('agent');
  });

  it('should reject staff linked to a non-existent user', () => {
    expect(() =>
      staffService.create({
        userId: 'unknown-id',
        matricule: 'AG-002',
        firstName: 'Test',
        lastName: 'User',
      }),
    ).toThrow();
  });

  it('should reject two staff accounts for the same user', () => {
    staffService.create({ userId, matricule: 'AG-001', firstName: 'Jean', lastName: 'Dupont' });
    expect(() =>
      staffService.create({ userId, matricule: 'AG-003', firstName: 'Autre', lastName: 'Agent' }),
    ).toThrow();
  });

  it('should find staff by userId', () => {
    staffService.create({ userId, matricule: 'AG-001', firstName: 'Jean', lastName: 'Dupont' });
    const found = staffService.findByUserId(userId);
    expect(found).toBeDefined();
    expect(found!.userId).toBe(userId);
  });
});
